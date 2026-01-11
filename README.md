# Techpit_fastapi

## ローカル CI / E2E テスト

このリポジトリは `docker-compose` を使用しています。ローカルで簡単なエンドツーエンドテストを実行する手順:

1. サービスをビルドして起動します:

```bash
docker compose up -d --build
```

2. バックエンドとデータベースが利用可能になるまで待ち、pytest の E2E テストを実行します:

```bash
pytest -q back/tests/test_e2e.py
```

3. テスト実行後、クリーンアップします:

```bash
docker compose down -v --remove-orphans
```

注意: CI ワークフロー (`.github/workflows/ci.yml`) は push/PR 時に同様の手順を実行します。
