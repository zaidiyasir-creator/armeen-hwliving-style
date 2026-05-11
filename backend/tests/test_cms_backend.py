"""Backend tests for Armeen HW CMS — auth, news, projects, services-overrides, uploads."""
import io
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://luxury-hotel-portal-4.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@armeenhw.com"
ADMIN_PASSWORD = "nYVD628EDNIF8B"


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def token(session):
    r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    assert r.status_code == 200, f"Login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "access_token" in data and data["access_token"]
    assert data["email"] == ADMIN_EMAIL
    return data["access_token"]


@pytest.fixture(scope="session")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


# -------- Health --------
class TestHealth:
    def test_root(self, session):
        r = session.get(f"{API}/", timeout=15)
        assert r.status_code == 200
        assert r.json().get("status") == "ok"


# -------- Auth --------
class TestAuth:
    def test_login_invalid(self, session):
        r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"}, timeout=15)
        assert r.status_code == 401

    def test_me_no_token(self, session):
        # plain GET without auth
        r = requests.get(f"{API}/auth/me", timeout=15)
        assert r.status_code == 401

    def test_me_with_token(self, auth_headers):
        r = requests.get(f"{API}/auth/me", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"

    def test_login_success(self, session):
        r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["email"] == ADMIN_EMAIL
        assert "access_token" in data and isinstance(data["access_token"], str)


# -------- Projects --------
class TestProjects:
    def test_list_projects_seeded(self):
        r = requests.get(f"{API}/projects", timeout=20)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= 11, f"Expected >=11 seeded projects, got {len(items)}"
        # check bilingual structure
        first = items[0]
        assert "slug" in first and "title" in first
        assert "en" in first["title"] and "bm" in first["title"]

    def test_get_project_by_slug(self):
        r = requests.get(f"{API}/projects/rumah-gadang-chalet-jempol", timeout=15)
        assert r.status_code == 200
        assert r.json()["slug"] == "rumah-gadang-chalet-jempol"

    def test_create_project_unauthorized(self):
        r = requests.post(f"{API}/projects", json={"slug": "TEST_unauth", "title": {"en": "x", "bm": "x"}, "category": {"en": "x", "bm": "x"}}, timeout=15)
        assert r.status_code == 401


# -------- News CRUD --------
class TestNewsCRUD:
    created_id = None

    def test_list_news(self):
        r = requests.get(f"{API}/news", timeout=15)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_create_news_unauthorized(self):
        r = requests.post(f"{API}/news", json={"title": {"en": "x", "bm": "x"}, "excerpt": {"en": "y", "bm": "y"}, "body": {"en": "z", "bm": "z"}}, timeout=15)
        assert r.status_code == 401

    def test_news_full_crud(self, auth_headers):
        # CREATE
        payload = {
            "title": {"en": "TEST_News Title", "bm": "TEST_Tajuk"},
            "excerpt": {"en": "TEST excerpt", "bm": "TEST petikan"},
            "body": {"en": "TEST body content", "bm": "TEST kandungan"},
            "cover_image": "https://example.com/test.png",
            "published": True,
        }
        r = requests.post(f"{API}/news", json=payload, headers=auth_headers, timeout=15)
        assert r.status_code == 200, r.text
        created = r.json()
        assert created["title"]["en"] == "TEST_News Title"
        assert "id" in created
        nid = created["id"]
        TestNewsCRUD.created_id = nid

        # GET listing should include it
        r = requests.get(f"{API}/news", timeout=15)
        assert r.status_code == 200
        ids = [n["id"] for n in r.json()]
        assert nid in ids

        # GET by id
        r = requests.get(f"{API}/news/{nid}", timeout=15)
        assert r.status_code == 200
        assert r.json()["id"] == nid

        # UPDATE
        upd = {"title": {"en": "TEST_Updated", "bm": "TEST_Dikemaskini"}}
        r = requests.put(f"{API}/news/{nid}", json=upd, headers=auth_headers, timeout=15)
        assert r.status_code == 200
        assert r.json()["title"]["en"] == "TEST_Updated"

        # DELETE
        r = requests.delete(f"{API}/news/{nid}", headers=auth_headers, timeout=15)
        assert r.status_code == 200

        # Verify removed
        r = requests.get(f"{API}/news/{nid}", timeout=15)
        assert r.status_code == 404


# -------- Uploads --------
class TestUploads:
    def test_upload_image(self, token):
        # Create a tiny PNG
        png = (b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
               b"\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xf8\xff"
               b"\xff?\x00\x05\xfe\x02\xfe\xdc\xccY\xe7\x00\x00\x00\x00IEND\xaeB`\x82")
        files = {"file": ("test.png", io.BytesIO(png), "image/png")}
        headers = {"Authorization": f"Bearer {token}"}
        r = requests.post(f"{API}/uploads", files=files, headers=headers, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["url"].startswith("/api/uploads/")
        # Verify served
        served = requests.get(f"{BASE_URL}{data['url']}", timeout=15)
        assert served.status_code == 200
        assert served.content[:8] == png[:8]

    def test_upload_unauthorized(self):
        files = {"file": ("test.png", io.BytesIO(b"x"), "image/png")}
        r = requests.post(f"{API}/uploads", files=files, timeout=15)
        assert r.status_code == 401


# -------- Services overrides --------
class TestServicesOverrides:
    def test_unauthorized_put(self):
        r = requests.put(f"{API}/services-overrides/construction", json={"key": "construction"}, timeout=15)
        assert r.status_code == 401

    def test_overrides_upsert_get_delete(self, auth_headers):
        body = {
            "key": "construction",
            "summary": {"en": "TEST overridden summary", "bm": "TEST ringkasan dikemaskini"},
            "bullets": [{"en": "TEST bullet", "bm": "TEST poin"}],
        }
        r = requests.put(f"{API}/services-overrides/construction", json=body, headers=auth_headers, timeout=15)
        assert r.status_code == 200, r.text
        doc = r.json()
        assert doc["key"] == "construction"
        assert doc["summary"]["en"] == "TEST overridden summary"

        r = requests.get(f"{API}/services-overrides", timeout=15)
        assert r.status_code == 200
        items = r.json()
        keys = [x["key"] for x in items]
        assert "construction" in keys

        r = requests.delete(f"{API}/services-overrides/construction", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        assert r.json()["ok"] is True


# -------- Static asset checks --------
class TestStaticAssets:
    @pytest.mark.parametrize("path", [
        "/armeen/catalogs/camera-catalog.pdf",
        "/armeen/catalogs/lens-catalog.pdf",
        "/armeen/catalogs/audio-catalog.pdf",
        "/armeen/videos/showreel-1.mp4",
        "/armeen/videos/showreel-2.mp4",
    ])
    def test_asset_head(self, path):
        r = requests.head(f"{BASE_URL}{path}", timeout=20, allow_redirects=True)
        # Some CDNs return 200 for HEAD; allow 200 or 206
        assert r.status_code in (200, 206), f"{path} returned {r.status_code}"
