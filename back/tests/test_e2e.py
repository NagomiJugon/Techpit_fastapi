import requests
import time


def wait_for(url, timeout=60):
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            r = requests.get(url, timeout=5)
            if r.status_code == 200:
                return r
        except Exception:
            pass
        time.sleep(1)
    raise RuntimeError(f"Service not available: {url}")


def test_categories_available():
    r = wait_for("http://localhost:8000/categories", timeout=60)
    data = r.json()
    assert isinstance(data, list)
    names = {c.get("name") for c in data}
    for expected in {"胸", "背中", "脚", "肩", "腕"}:
        assert expected in names


def test_exercises_available():
    r = wait_for("http://localhost:8000/exercises", timeout=60)
    data = r.json()
    assert isinstance(data, list)


def test_exercise_records_endpoint():
    r = wait_for("http://localhost:8000/exercise_records", timeout=60)
    data = r.json()
    assert isinstance(data, list)
