# Techpit_fastapi

## Local CI / E2E test

To run the simple end-to-end tests locally (the repo uses docker-compose):

1. Build and start services:

```bash
docker compose up -d --build
```

2. Wait until the backend is available and the DB is ready, then run the pytest E2E file:

```bash
pytest -q back/tests/test_e2e.py
```

3. When finished, tear down:

```bash
docker compose down -v --remove-orphans
```

Note: The CI workflow `.github/workflows/ci.yml` will run similar steps on push/PR.
