from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import uuid
import logging
import bcrypt
import jwt
import shutil
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Any

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr

# ============================================================================
# CONFIG / DB
# ============================================================================

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
JWT_SECRET = os.environ["JWT_SECRET"]
ADMIN_USERNAME = os.environ["ADMIN_USERNAME"]
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"]
JWT_ALG = "HS256"
ACCESS_TOKEN_MIN = 60 * 24  # 24h

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("armeen")

# ============================================================================
# APP + ROUTERS
# ============================================================================

app = FastAPI(title="Armeen HW Enterprise — CMS API")
api = APIRouter(prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origin_regex=".*",
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded files
app.mount("/api/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# ============================================================================
# AUTH HELPERS
# ============================================================================


def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt(rounds=12)).decode()


def verify_password(pw: str, hashed: str) -> bool:
    return bcrypt.checkpw(pw.encode(), hashed.encode())


def create_access_token(username: str, role: str) -> str:
    payload = {
        "sub": username,
        "username": username,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_MIN),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = await db.users.find_one({"username": payload.get("username")}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# ============================================================================
# PYDANTIC MODELS
# ============================================================================


class LoginIn(BaseModel):
    username: str
    password: str


class ChangePasswordIn(BaseModel):
    current_password: str
    new_password: str


class UserOut(BaseModel):
    username: str
    name: str
    role: str


class BiText(BaseModel):
    en: str
    bm: str


class NewsCreate(BaseModel):
    title: BiText
    excerpt: BiText
    body: BiText
    cover_image: Optional[str] = None  # URL or /api/uploads/... path
    tag: Optional[BiText] = None
    published: bool = True
    published_at: Optional[str] = None  # ISO date string


class NewsUpdate(BaseModel):
    title: Optional[BiText] = None
    excerpt: Optional[BiText] = None
    body: Optional[BiText] = None
    cover_image: Optional[str] = None
    tag: Optional[BiText] = None
    published: Optional[bool] = None
    published_at: Optional[str] = None


class HighlightItem(BaseModel):
    en: str
    bm: str


class ProjectCreate(BaseModel):
    slug: str
    title: BiText
    category: BiText
    location: str = ""
    client: str = ""
    year: str = ""
    scope: BiText = BiText(en="", bm="")
    cover: str = ""
    gallery: List[str] = []
    summary: BiText = BiText(en="", bm="")
    highlights: List[HighlightItem] = []


class ProjectUpdate(BaseModel):
    title: Optional[BiText] = None
    category: Optional[BiText] = None
    location: Optional[str] = None
    client: Optional[str] = None
    year: Optional[str] = None
    scope: Optional[BiText] = None
    cover: Optional[str] = None
    gallery: Optional[List[str]] = None
    summary: Optional[BiText] = None
    highlights: Optional[List[HighlightItem]] = None


class CatalogItem(BaseModel):
    url: str
    label: BiText
    filename: Optional[str] = None


class GalleryItem(BaseModel):
    src: str
    label: BiText


class ServiceOverride(BaseModel):
    key: str
    title: Optional[BiText] = None
    summary: Optional[BiText] = None
    bullets: Optional[List[HighlightItem]] = None
    catalogs: Optional[List[CatalogItem]] = None
    gallery: Optional[List[GalleryItem]] = None


# ============================================================================
# AUTH ENDPOINTS
# ============================================================================


def _set_cookie(response: Response, token: str):
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=ACCESS_TOKEN_MIN * 60,
        path="/",
    )


@api.post("/auth/login")
async def login(body: LoginIn, response: Response):
    username = body.username.strip().lower()
    user = await db.users.find_one({"username": username})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(user["username"], user.get("role", "admin"))
    _set_cookie(response, token)
    return {
        "username": user["username"],
        "name": user.get("name", "Admin"),
        "role": user.get("role", "admin"),
        "access_token": token,  # also returned for Bearer fallback
    }


@api.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}


@api.get("/auth/me", response_model=UserOut)
async def me(user=Depends(get_current_user)):
    return UserOut(**user)


@api.post("/auth/change-password")
async def change_password(body: ChangePasswordIn, user=Depends(get_current_user)):
    if len(body.new_password) < 8:
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters")
    doc = await db.users.find_one({"username": user["username"]})
    if not doc or not verify_password(body.current_password, doc["password_hash"]):
        raise HTTPException(status_code=401, detail="Current password is incorrect")
    await db.users.update_one(
        {"username": user["username"]},
        {"$set": {"password_hash": hash_password(body.new_password),
                  "password_updated_at": datetime.now(timezone.utc).isoformat()}},
    )
    return {"ok": True}


# ============================================================================
# FILE UPLOAD
# ============================================================================


@api.post("/uploads")
async def upload_file(file: UploadFile = File(...), user=Depends(get_current_user)):
    # Sanitize filename
    ext = Path(file.filename).suffix.lower()
    if ext not in {".png", ".jpg", ".jpeg", ".webp", ".pdf", ".mp4", ".mov", ".gif"}:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    name = f"{uuid.uuid4().hex}{ext}"
    out = UPLOAD_DIR / name
    with out.open("wb") as f:
        shutil.copyfileobj(file.file, f)
    return {"url": f"/api/uploads/{name}", "filename": file.filename}


# ============================================================================
# NEWS
# ============================================================================


@api.get("/news")
async def list_news(only_published: bool = True, include_scheduled: bool = False):
    if only_published:
        now_iso = datetime.now(timezone.utc).isoformat()
        # Public: published AND (published_at <= now)  — scheduled future posts excluded
        query = {"published": True}
        if not include_scheduled:
            query["$or"] = [
                {"published_at": {"$lte": now_iso}},
                {"published_at": {"$exists": False}},
                {"published_at": None},
            ]
    else:
        query = {}
    docs = await db.news.find(query, {"_id": 0}).sort("published_at", -1).to_list(200)
    return docs


@api.get("/news/{news_id}")
async def get_news(news_id: str):
    doc = await db.news.find_one({"id": news_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")
    return doc


@api.post("/news")
async def create_news(body: NewsCreate, user=Depends(get_current_user)):
    doc = body.model_dump()
    doc["id"] = uuid.uuid4().hex
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    doc["published_at"] = doc.get("published_at") or doc["created_at"]
    await db.news.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api.put("/news/{news_id}")
async def update_news(news_id: str, body: NewsUpdate, user=Depends(get_current_user)):
    update = {k: v for k, v in body.model_dump().items() if v is not None}
    if not update:
        raise HTTPException(status_code=400, detail="No fields to update")
    update["updated_at"] = datetime.now(timezone.utc).isoformat()
    res = await db.news.update_one({"id": news_id}, {"$set": update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    doc = await db.news.find_one({"id": news_id}, {"_id": 0})
    return doc


@api.delete("/news/{news_id}")
async def delete_news(news_id: str, user=Depends(get_current_user)):
    res = await db.news.delete_one({"id": news_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}


# ============================================================================
# PROJECTS
# ============================================================================


@api.get("/projects")
async def list_projects():
    docs = await db.projects.find({}, {"_id": 0}).sort("order", 1).to_list(200)
    return docs


@api.get("/projects/{slug}")
async def get_project(slug: str):
    doc = await db.projects.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")
    return doc


@api.post("/projects")
async def create_project(body: ProjectCreate, user=Depends(get_current_user)):
    existing = await db.projects.find_one({"slug": body.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    count = await db.projects.count_documents({})
    doc = body.model_dump()
    doc["order"] = count
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.projects.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api.put("/projects/{slug}")
async def update_project(slug: str, body: ProjectUpdate, user=Depends(get_current_user)):
    update = {k: v for k, v in body.model_dump().items() if v is not None}
    if not update:
        raise HTTPException(status_code=400, detail="No fields to update")
    update["updated_at"] = datetime.now(timezone.utc).isoformat()
    res = await db.projects.update_one({"slug": slug}, {"$set": update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    doc = await db.projects.find_one({"slug": slug}, {"_id": 0})
    return doc


@api.delete("/projects/{slug}")
async def delete_project(slug: str, user=Depends(get_current_user)):
    res = await db.projects.delete_one({"slug": slug})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}


# ============================================================================
# SERVICES OVERRIDES
# ============================================================================


@api.get("/services-overrides")
async def list_services_overrides():
    docs = await db.services_overrides.find({}, {"_id": 0}).to_list(50)
    return docs


@api.put("/services-overrides/{key}")
async def upsert_service_override(key: str, body: ServiceOverride, user=Depends(get_current_user)):
    update = {k: v for k, v in body.model_dump().items() if v is not None}
    update["key"] = key
    update["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.services_overrides.update_one({"key": key}, {"$set": update}, upsert=True)
    doc = await db.services_overrides.find_one({"key": key}, {"_id": 0})
    return doc


@api.delete("/services-overrides/{key}")
async def delete_service_override(key: str, user=Depends(get_current_user)):
    res = await db.services_overrides.delete_one({"key": key})
    return {"ok": res.deleted_count > 0}


# ============================================================================
# SITE SETTINGS (About → Company Profile PDF, etc.)
# ============================================================================


class ContactInfo(BaseModel):
    phone_primary: Optional[str] = None
    phone_secondary: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    hours_en: Optional[str] = None
    hours_bm: Optional[str] = None


class SiteSettingsIn(BaseModel):
    company_profile_url: Optional[str] = None
    company_profile_filename: Optional[str] = None
    about_gallery: Optional[List[GalleryItem]] = None
    contact: Optional[ContactInfo] = None


@api.get("/site-settings")
async def get_site_settings():
    doc = await db.site_settings.find_one({"key": "main"}, {"_id": 0, "key": 0}) or {}
    return doc


@api.put("/site-settings")
async def update_site_settings(body: SiteSettingsIn, user=Depends(get_current_user)):
    update = {k: v for k, v in body.model_dump().items() if v is not None}
    update["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.site_settings.update_one({"key": "main"}, {"$set": update}, upsert=True)
    doc = await db.site_settings.find_one({"key": "main"}, {"_id": 0, "key": 0})
    return doc


# ============================================================================
# HEALTH
# ============================================================================


@api.get("/")
async def root():
    return {"service": "Armeen HW Enterprise CMS", "status": "ok"}


app.include_router(api)


# ============================================================================
# STARTUP — SEED ADMIN + DEFAULT PROJECTS
# ============================================================================


DEFAULT_PROJECTS = [
    {
        "slug": "rumah-gadang-chalet-jempol",
        "title": {"en": "Rumah Gadang & 6-Chalet Resort, Jempol", "bm": "Rumah Gadang & 6 Chalet Resort, Jempol"},
        "category": {"en": "Resort · Heritage Architecture", "bm": "Resort · Senibina Warisan"},
        "location": "Lot 1411, Mukim Jelai, Jempol, Negeri Sembilan",
        "client": "Private Owner",
        "year": "2023 – 2024",
        "scope": {"en": "Civil · Structural · Architectural Finishing · MEP", "bm": "Awam · Struktur · Kemasan Senibina · MEP"},
        "cover": "/armeen/projects/p46_2.jpg",
        "gallery": ["/armeen/projects/p46_2.jpg", "/armeen/projects/p46_1.jpg", "/armeen/projects/p47_2.jpg", "/armeen/projects/p47_1.jpg"],
        "summary": {
            "en": "Construction and completion of a traditional Minangkabau Rumah Gadang and a six-unit two-storey chalet resort on a one-acre site in Jempol — combining heritage joinery with modern MEP and civil engineering.",
            "bm": "Pembinaan dan penyiapan sebuah Rumah Gadang tradisi Minangkabau serta resort chalet dua tingkat enam unit di atas tapak satu ekar di Jempol — menggabungkan seni joinery warisan dengan kejuruteraan MEP dan awam moden.",
        },
        "highlights": [
            {"en": "Traditional Minangkabau gonjong roof system", "bm": "Sistem bumbung gonjong Minangkabau tradisi"},
            {"en": "Six independent 2-storey chalet villas", "bm": "Enam vila chalet dua tingkat berasingan"},
            {"en": "Full civil, drainage, septic & utility works", "bm": "Kerja awam, saliran, septik & utiliti penuh"},
            {"en": "Integrated electrical, water and fire systems", "bm": "Sistem elektrik, air dan kebakaran bersepadu"},
        ],
    },
    {
        "slug": "rumah-gadang-batu-kikir",
        "title": {"en": "Rumah Gadang Residence, Batu Kikir", "bm": "Kediaman Rumah Gadang, Batu Kikir"},
        "category": {"en": "Residential · Heritage", "bm": "Kediaman · Warisan"},
        "location": "Batu Kikir, Jempol, Negeri Sembilan",
        "client": "Private Owner",
        "year": "2022 – 2023",
        "scope": {"en": "Civil · Structural · Architectural", "bm": "Awam · Struktur · Senibina"},
        "cover": "/armeen/projects/p47_2.jpg",
        "gallery": ["/armeen/projects/p47_2.jpg", "/armeen/projects/p47_1.jpg"],
        "summary": {
            "en": "Construction of a single Rumah Gadang residence in Batu Kikir, Jempol — preserving traditional craftsmanship with engineered modern foundations.",
            "bm": "Pembinaan sebuah kediaman Rumah Gadang di Batu Kikir, Jempol — mengekalkan kemahiran tradisi dengan asas moden yang dijuruterai.",
        },
        "highlights": [
            {"en": "Authentic Minangkabau ridge profile", "bm": "Profil bumbung Minangkabau autentik"},
            {"en": "Engineered RC footing and tie-beams", "bm": "Footing RC dan tie-beam dijuruterai"},
        ],
    },
    {
        "slug": "ds-consultant-office-fitout",
        "title": {"en": "DS Consultant — Ground Floor Office Build-out", "bm": "DS Consultant — Pembinaan Ruang Pejabat Tingkat Bawah"},
        "category": {"en": "Commercial Fit-out", "bm": "Pengubahsuaian Komersial"},
        "location": "Betaria Business Center, Seremban, Negeri Sembilan",
        "client": "DS Consultant Sdn Bhd",
        "year": "2023",
        "scope": {"en": "Architectural · MEP · Finishing", "bm": "Senibina · MEP · Kemasan"},
        "cover": "/armeen/projects/p48_2.jpg",
        "gallery": ["/armeen/projects/p48_2.jpg", "/armeen/projects/p48_1.jpg"],
        "summary": {
            "en": "Construction and completion of a corporate office suite for DS Consultant Sdn Bhd at Betaria Business Center, Seremban.",
            "bm": "Pembinaan dan penyiapan ruang pejabat korporat DS Consultant Sdn Bhd di Betaria Business Center, Seremban.",
        },
        "highlights": [
            {"en": "Custom millwork and timber joinery", "bm": "Kerja kayu dan joinery khusus"},
            {"en": "Full electrical and data cabling", "bm": "Pendawaian elektrik dan data lengkap"},
        ],
    },
    {
        "slug": "betaria-level-one-office",
        "title": {"en": "Level One Office Suite, Betaria", "bm": "Ruang Pejabat Tingkat Satu, Betaria"},
        "category": {"en": "Commercial Fit-out", "bm": "Pengubahsuaian Komersial"},
        "location": "Betaria Business Center, Seremban",
        "client": "Private Tenant",
        "year": "2023",
        "scope": {"en": "Architectural · Finishing · Joinery", "bm": "Senibina · Kemasan · Joinery"},
        "cover": "/armeen/projects/p49_2.jpg",
        "gallery": ["/armeen/projects/p49_2.jpg", "/armeen/projects/p49_1.jpg"],
        "summary": {"en": "Architectural construction and complete fit-out of a first-floor office suite at Betaria Business Center, Seremban.", "bm": "Pembinaan senibina dan kemasan lengkap ruang pejabat tingkat satu di Betaria Business Center, Seremban."},
        "highlights": [
            {"en": "Modern open-plan layout", "bm": "Susun atur ruang terbuka moden"},
            {"en": "Glazed partitions and acoustic finishing", "bm": "Sekatan kaca dan kemasan akustik"},
        ],
    },
    {
        "slug": "spc-uv-flooring-bangi",
        "title": {"en": "SPC Flooring & UV Coating — BHDSB HQ, Bangi", "bm": "Lantai SPC & UV Coating — Ibu Pejabat BHDSB, Bangi"},
        "category": {"en": "Architectural Finishing", "bm": "Kemasan Senibina"},
        "location": "Bandar Seri Putra, Bangi, Selangor",
        "client": "Bangi Heights Development Sdn Bhd",
        "year": "2024",
        "scope": {"en": "SPC Flooring · UV Coating · PVC Skirting", "bm": "Lantai SPC · UV Coating · PVC Skirting"},
        "cover": "/armeen/projects/p50_2.jpg",
        "gallery": ["/armeen/projects/p50_2.jpg", "/armeen/projects/p50_1.jpg", "/armeen/projects/p55_2.jpg", "/armeen/projects/p55_3.jpg"],
        "summary": {"en": "Supply and installation of SPC flooring with UV coating and PVC side skirting at the second-floor head office of Bangi Heights Development Sdn Bhd.", "bm": "Pembekalan dan pemasangan lantai SPC dengan UV coating dan PVC side skirting di tingkat dua pejabat utama Bangi Heights Development Sdn Bhd."},
        "highlights": [
            {"en": "Premium 5 mm SPC plank flooring", "bm": "Lantai SPC plank premium 5 mm"},
            {"en": "UV-cured protective top coat", "bm": "Lapisan pelindung UV-cured"},
        ],
    },
    {
        "slug": "masjid-tuanku-jaafar",
        "title": {"en": "Masjid Taman Tuanku Ja'afar — Renovation", "bm": "Masjid Taman Tuanku Ja'afar — Pengubahsuaian"},
        "category": {"en": "Religious · Renovation", "bm": "Keagamaan · Pengubahsuaian"},
        "location": "Taman Tuanku Ja'afar, Negeri Sembilan",
        "client": "Jawatankuasa Masjid",
        "year": "2023 – 2024",
        "scope": {"en": "Renovation · MEP · Architectural Finishing", "bm": "Pengubahsuaian · MEP · Kemasan Senibina"},
        "cover": "/armeen/projects/p51_2.jpg",
        "gallery": ["/armeen/projects/p51_2.jpg", "/armeen/projects/p51_1.jpg"],
        "summary": {"en": "Comprehensive renovation and refurbishment of Masjid Taman Tuanku Ja'afar — including main prayer hall flooring, lighting, glazing and decorative panelling.", "bm": "Pengubahsuaian dan pembaharuan menyeluruh Masjid Taman Tuanku Ja'afar — termasuk lantai dewan solat utama, pencahayaan, kaca dan panel hiasan."},
        "highlights": [
            {"en": "Restored arched window mouldings", "bm": "Pemulihan acuan tingkap lengkok"},
            {"en": "New blue prayer carpet system", "bm": "Sistem permaidani solat biru baharu"},
            {"en": "Modern glazed entrance partitions", "bm": "Sekatan kaca pintu masuk moden"},
        ],
    },
    {
        "slug": "hulu-selangor-infra-fencing",
        "title": {"en": "Hulu Selangor — Infrastructure & Perimeter Fencing", "bm": "Hulu Selangor — Infrastruktur & Pemagaran"},
        "category": {"en": "Civil & Infrastructure", "bm": "Awam & Infrastruktur"},
        "location": "Mukim Lot 1384, Hulu Selangor, Selangor",
        "client": "Private Landowner",
        "year": "2024",
        "scope": {"en": "Civil Earthworks · Metal Deck Perimeter Fencing", "bm": "Kerja Tanah · Pemagaran Metal Deck"},
        "cover": "/armeen/projects/p52_2.jpg",
        "gallery": ["/armeen/projects/p52_2.jpg", "/armeen/projects/p52_1.jpg"],
        "summary": {"en": "Civil infrastructure works and supply-and-install of one-acre metal-deck perimeter fencing in Hulu Selangor.", "bm": "Kerja infrastruktur awam dan pembekalan-pemasangan pagar metal deck seekar di Hulu Selangor."},
        "highlights": [
            {"en": "Site preparation and access grading", "bm": "Penyediaan tapak dan gred laluan"},
            {"en": "Heavy-duty metal deck perimeter", "bm": "Pagar perimeter metal deck heavy-duty"},
        ],
    },
    {
        "slug": "nusa-subang-full-renovation",
        "title": {"en": "Full Renovation — Nusa Subang Residence", "bm": "Pengubahsuaian Penuh — Kediaman Nusa Subang"},
        "category": {"en": "Residential · Full Renovation", "bm": "Kediaman · Pengubahsuaian Penuh"},
        "location": "Nusa Subang, Seksyen U5, Shah Alam",
        "client": "Private Owner",
        "year": "2024",
        "scope": {"en": "Renovation · Architectural · MEP", "bm": "Pengubahsuaian · Senibina · MEP"},
        "cover": "/armeen/projects/p53_2.jpg",
        "gallery": ["/armeen/projects/p53_2.jpg", "/armeen/projects/p53_1.jpg", "/armeen/projects/p53_3.jpg"],
        "summary": {"en": "Complete external and internal renovation works of a residential property at No. 5, Jalan Qamari U5/109, Nusa Subang, Shah Alam.", "bm": "Kerja pengubahsuaian luar dan dalam menyeluruh sebuah kediaman di No. 5, Jalan Qamari U5/109, Nusa Subang, Shah Alam."},
        "highlights": [
            {"en": "Façade rework and external painting", "bm": "Pembaharuan fasad dan cat luar"},
            {"en": "Complete internal finishing refresh", "bm": "Pembaharuan kemasan dalaman lengkap"},
        ],
    },
    {
        "slug": "spd-jurukur-teras",
        "title": {"en": "SPD Installation — Jurukur Teras Office", "bm": "Pemasangan SPD — Pejabat Jurukur Teras"},
        "category": {"en": "Electrical · MEP", "bm": "Elektrikal · MEP"},
        "location": "Jurukur Teras Sdn Bhd, Office",
        "client": "Jurukur Teras Sdn Bhd",
        "year": "2024",
        "scope": {"en": "Surge Protective Devices · Electrical Safety", "bm": "Surge Protective Devices · Keselamatan Elektrik"},
        "cover": "/armeen/projects/p54_2.jpg",
        "gallery": ["/armeen/projects/p54_2.jpg", "/armeen/projects/p54_3.jpg", "/armeen/projects/p54_4.jpg", "/armeen/projects/p54_5.jpg"],
        "summary": {"en": "Supply and installation of Surge Protective Devices (SPD) on levels 1 and 2 of the Jurukur Teras Sdn Bhd office.", "bm": "Pembekalan dan pemasangan Surge Protective Devices (SPD) pada tingkat 1 dan 2 pejabat Jurukur Teras Sdn Bhd."},
        "highlights": [
            {"en": "Multi-tier surge protection topology", "bm": "Topologi perlindungan surge berlapis"},
            {"en": "DB-level coordination and testing", "bm": "Penyelarasan dan ujian peringkat DB"},
        ],
    },
    {
        "slug": "pabx-network-deployment",
        "title": {"en": "PABX & Network Telephony Deployment", "bm": "Penggunaan PABX & Telefoni Rangkaian"},
        "category": {"en": "ICT · Telephony", "bm": "ICT · Telefoni"},
        "location": "Multiple Sites, Negeri Sembilan",
        "client": "Corporate Clients",
        "year": "2023 – 2024",
        "scope": {"en": "PABX · SIP Trunk · IP Telephony · Network", "bm": "PABX · SIP Trunk · IP Telephony · Rangkaian"},
        "cover": "/armeen/projects/p56_2.jpg",
        "gallery": ["/armeen/projects/p56_2.jpg", "/armeen/projects/p56_3.jpg", "/armeen/projects/p56_4.jpg", "/armeen/projects/p56_5.jpg"],
        "summary": {"en": "End-to-end design, supply and installation of PABX phone systems — including SIP trunks, IVR, extension provisioning, call recording, ring groups and integrated LAN/VLAN telephony.", "bm": "Reka bentuk, pembekalan dan pemasangan hujung-ke-hujung sistem telefoni PABX — termasuk SIP trunk, IVR, peruntukan extension, rakaman panggilan, ring group dan telefoni LAN/VLAN bersepadu."},
        "highlights": [
            {"en": "IP/analog hybrid PABX architecture", "bm": "Senibina PABX hibrid IP/analog"},
            {"en": "Auto-attendant IVR with time-conditions", "bm": "IVR auto-attendant dengan syarat masa"},
            {"en": "Call recording and quality monitoring", "bm": "Rakaman panggilan dan pemantauan kualiti"},
        ],
    },
    {
        "slug": "server-data-management",
        "title": {"en": "Server & Data Management Systems", "bm": "Sistem Server & Pengurusan Data"},
        "category": {"en": "ICT · Servers & Data", "bm": "ICT · Server & Data"},
        "location": "Enterprise Clients, Klang Valley",
        "client": "Corporate & SME",
        "year": "2023 – 2024",
        "scope": {"en": "Server Build · Networking · Security · Backup", "bm": "Pembinaan Server · Rangkaian · Keselamatan · Backup"},
        "cover": "/armeen/projects/p57_2.jpg",
        "gallery": ["/armeen/projects/p57_2.jpg", "/armeen/projects/p57_3.jpg", "/armeen/projects/p58_2.jpg", "/armeen/projects/p58_3.jpg"],
        "summary": {"en": "Installation and configuration of enterprise server systems (Windows/Linux), domain & user provisioning, secure network setup (LAN/WAN, VPN, firewall), and full backup & recovery frameworks.", "bm": "Pemasangan dan konfigurasi sistem server enterprise (Windows/Linux), peruntukan domain & pengguna, persediaan rangkaian selamat (LAN/WAN, VPN, firewall), serta rangka backup & pemulihan penuh."},
        "highlights": [
            {"en": "Windows / Linux server provisioning", "bm": "Peruntukan server Windows / Linux"},
            {"en": "Firewall, VPN and security policies", "bm": "Firewall, VPN dan polisi keselamatan"},
            {"en": "Scheduled backup & DR drills", "bm": "Backup berjadual & latihan DR"},
        ],
    },
]


@app.on_event("startup")
async def on_startup():
    # Drop legacy email-based unique index if it still exists (migration from email→username)
    try:
        existing_indexes = await db.users.index_information()
        if "email_1" in existing_indexes:
            await db.users.drop_index("email_1")
            logger.info("Dropped legacy users.email_1 index")
    except Exception as e:
        logger.warning("Index check failed: %s", e)

    # Remove legacy admin documents that don't have a username field (cleanup before unique index)
    await db.users.delete_many({"username": {"$exists": False}})

    # Indexes
    await db.users.create_index("username", unique=True)
    await db.news.create_index("id", unique=True)
    await db.projects.create_index("slug", unique=True)
    await db.services_overrides.create_index("key", unique=True)

    # Seed admin
    admin_username = ADMIN_USERNAME.strip().lower()
    existing = await db.users.find_one({"username": admin_username})
    if not existing:
        await db.users.insert_one({
            "username": admin_username,
            "password_hash": hash_password(ADMIN_PASSWORD),
            "name": "Armeen Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Seeded admin user: %s", admin_username)
    # Note: do NOT auto-reset password on every restart — admin may have changed it via /api/auth/change-password.

    # Seed default projects (only if collection empty)
    if await db.projects.count_documents({}) == 0:
        for i, p in enumerate(DEFAULT_PROJECTS):
            doc = dict(p)
            doc["order"] = i
            doc["created_at"] = datetime.now(timezone.utc).isoformat()
            await db.projects.insert_one(doc)
        logger.info("Seeded %d default projects", len(DEFAULT_PROJECTS))


@app.on_event("shutdown")
async def on_shutdown():
    client.close()
