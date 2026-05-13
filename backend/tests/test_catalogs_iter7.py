"""Iteration 7 backend tests: services-overrides catalogs + uploads + regression."""
import os
import io
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://luxury-hotel-portal-4.preview.emergentagent.com").rstrip("/")
ADMIN_EMAIL = "admin@armeenhw.com"
ADMIN_PASSWORD = "nYVD628EDNIF8B"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    r = s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    assert r.status_code == 200, f"Login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "access_token" in data
    s.headers.update({"Authorization": f"Bearer {data['access_token']}"})
    return s


@pytest.fixture(scope="module")
def cleanup(session):
    yield
    # Cleanup test override for 'it' and any orphans
    session.delete(f"{BASE_URL}/api/services-overrides/it", timeout=20)


# ----------------- Health / Auth -----------------

def test_health():
    r = requests.get(f"{BASE_URL}/api/", timeout=20)
    assert r.status_code == 200
    assert r.json().get("status") == "ok"


def test_auth_me(session):
    r = session.get(f"{BASE_URL}/api/auth/me", timeout=20)
    assert r.status_code == 200
    body = r.json()
    assert body["email"] == ADMIN_EMAIL
    assert body["role"] == "admin"


# ----------------- Uploads (PDF) -----------------

def test_upload_pdf_success(session):
    pdf_path = "/app/frontend/public/armeen/catalogs/camera-catalog.pdf"
    with open(pdf_path, "rb") as f:
        files = {"file": ("camera-catalog.pdf", f, "application/pdf")}
        r = session.post(f"{BASE_URL}/api/uploads", files=files, timeout=60)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "url" in data and data["url"].startswith("/api/uploads/")
    assert data["url"].endswith(".pdf")
    assert data["filename"] == "camera-catalog.pdf"
    # Verify file is publicly served
    r2 = requests.get(f"{BASE_URL}{data['url']}", timeout=30)
    assert r2.status_code == 200
    assert r2.headers.get("content-type", "").startswith("application/pdf")
    pytest.uploaded_url = data["url"]


def test_upload_rejects_non_whitelisted(session):
    files = {"file": ("evil.exe", io.BytesIO(b"MZ\x00"), "application/octet-stream")}
    r = session.post(f"{BASE_URL}/api/uploads", files=files, timeout=20)
    assert r.status_code == 400


def test_upload_requires_auth():
    files = {"file": ("a.pdf", io.BytesIO(b"%PDF-1.4\n"), "application/pdf")}
    r = requests.post(f"{BASE_URL}/api/uploads", files=files, timeout=20)
    assert r.status_code == 401


# ----------------- Services-overrides with catalogs -----------------

def test_services_overrides_list_excludes_id(session):
    r = requests.get(f"{BASE_URL}/api/services-overrides", timeout=20)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    for d in data:
        assert "_id" not in d


def test_put_catalogs_on_it_division(session, cleanup):
    url = getattr(pytest, "uploaded_url", "/api/uploads/test.pdf")
    payload = {
        "key": "it",
        "catalogs": [
            {"url": url, "label": {"en": "IT Brochure EN", "bm": "Brosur IT BM"}, "filename": "camera-catalog.pdf"}
        ],
    }
    r = session.put(f"{BASE_URL}/api/services-overrides/it", json=payload, timeout=20)
    assert r.status_code == 200, r.text
    doc = r.json()
    assert doc["key"] == "it"
    assert isinstance(doc["catalogs"], list) and len(doc["catalogs"]) == 1
    assert doc["catalogs"][0]["url"] == url
    assert doc["catalogs"][0]["label"]["en"] == "IT Brochure EN"
    assert doc["catalogs"][0]["label"]["bm"] == "Brosur IT BM"

    # Verify persistence via GET
    r2 = requests.get(f"{BASE_URL}/api/services-overrides", timeout=20)
    assert r2.status_code == 200
    found = next((d for d in r2.json() if d["key"] == "it"), None)
    assert found is not None
    assert "_id" not in found
    assert found["catalogs"][0]["label"]["bm"] == "Brosur IT BM"


def test_put_catalogs_empty_clears(session, cleanup):
    # Empty array should be stored (frontend uses it to "clear" defaults)
    payload = {"key": "it", "catalogs": []}
    r = session.put(f"{BASE_URL}/api/services-overrides/it", json=payload, timeout=20)
    assert r.status_code == 200
    doc = r.json()
    assert doc.get("catalogs") == []


def test_put_catalogs_on_production(session):
    payload = {
        "key": "production",
        "catalogs": [
            {"url": "/api/uploads/prod1.pdf", "label": {"en": "Production Reel", "bm": "Reel Produksi"}}
        ],
    }
    r = session.put(f"{BASE_URL}/api/services-overrides/production", json=payload, timeout=20)
    assert r.status_code == 200
    doc = r.json()
    assert len(doc["catalogs"]) == 1
    # Cleanup
    session.delete(f"{BASE_URL}/api/services-overrides/production", timeout=20)


def test_put_overrides_requires_auth():
    r = requests.put(f"{BASE_URL}/api/services-overrides/it", json={"key": "it", "catalogs": []}, timeout=20)
    assert r.status_code == 401


# ----------------- Regression: title/summary/bullets still work -----------------

def test_regression_title_summary_bullets(session):
    payload = {
        "key": "it",
        "title": {"en": "TEST IT Title", "bm": "TEST IT Tajuk"},
        "summary": {"en": "TEST summary", "bm": "TEST ringkasan"},
        "bullets": [{"en": "Bullet 1", "bm": "Poin 1"}],
        "catalogs": [],
    }
    r = session.put(f"{BASE_URL}/api/services-overrides/it", json=payload, timeout=20)
    assert r.status_code == 200, r.text
    doc = r.json()
    assert doc["title"]["en"] == "TEST IT Title"
    assert doc["summary"]["bm"] == "TEST ringkasan"
    assert doc["bullets"][0]["en"] == "Bullet 1"
    # cleanup
    session.delete(f"{BASE_URL}/api/services-overrides/it", timeout=20)


# ----------------- Regression: news + projects -----------------

def test_news_list_public():
    r = requests.get(f"{BASE_URL}/api/news", timeout=20)
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_projects_list_public():
    r = requests.get(f"{BASE_URL}/api/projects", timeout=20)
    assert r.status_code == 200
    arr = r.json()
    assert isinstance(arr, list) and len(arr) >= 1
    for p in arr:
        assert "_id" not in p
        assert "slug" in p


def test_news_create_update_delete(session):
    body = {
        "title": {"en": "TEST_news", "bm": "TEST_news_bm"},
        "excerpt": {"en": "e", "bm": "e"},
        "body": {"en": "b", "bm": "b"},
        "published": True,
    }
    r = session.post(f"{BASE_URL}/api/news", json=body, timeout=20)
    assert r.status_code == 200, r.text
    nid = r.json()["id"]
    # Update
    r2 = session.put(f"{BASE_URL}/api/news/{nid}", json={"title": {"en": "TEST_news_updated", "bm": "x"}}, timeout=20)
    assert r2.status_code == 200
    assert r2.json()["title"]["en"] == "TEST_news_updated"
    # Get
    r3 = requests.get(f"{BASE_URL}/api/news/{nid}", timeout=20)
    assert r3.status_code == 200
    assert "_id" not in r3.json()
    # Delete
    r4 = session.delete(f"{BASE_URL}/api/news/{nid}", timeout=20)
    assert r4.status_code == 200
