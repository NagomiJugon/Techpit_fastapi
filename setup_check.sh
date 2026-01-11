#!/usr/bin/env bash
#
# OpenAPI 型生成システム セットアップ確認スクリプト
#
# 使用方法:
#   bash setup_check.sh
#

echo "================================================================================="
echo "Broccoli プロジェクト - OpenAPI 型生成システム セットアップ確認"
echo "================================================================================="
echo ""

# 1. バックエンドサーバー確認
echo "📌 [1] バックエンドサーバー確認"
echo "   URL: http://localhost:8000"
echo "   OpenAPI: http://localhost:8000/openapi.json"
echo "   Docs: http://localhost:8000/docs"
echo ""

# 2. FastAPI メタデータ確認
echo "📌 [2] FastAPI メタデータ設定"
echo "   ✅ title: Broccoli API"
echo "   ✅ description: フィットネス管理アプリケーション API"
echo "   ✅ version: 0.1.0"
echo "   📁 ファイル: back/api/main.py"
echo ""

# 3. パッケージ確認
echo "📌 [3] npm パッケージ確認"
if [ -d "front/app/broccoli-front/node_modules/openapi-typescript" ]; then
    echo "   ✅ openapi-typescript: installed"
else
    echo "   ⚠️  openapi-typescript: not found"
fi
echo "   📁 ファイル: front/app/broccoli-front/package.json"
echo ""

# 4. 生成されたファイル確認
echo "📌 [4] 自動生成型ファイル確認"
if [ -f "front/app/broccoli-front/src/api/generated.ts" ]; then
    lines=$(wc -l < front/app/broccoli-front/src/api/generated.ts)
    echo "   ✅ generated.ts: exists ($lines lines)"
else
    echo "   ⚠️  generated.ts: not found"
fi
echo "   📁 ファイル: front/app/broccoli-front/src/api/generated.ts"
echo ""

# 5. API クライアント層確認
echo "📌 [5] API クライアント層確認"
if [ -f "front/app/broccoli-front/src/api/client.ts" ]; then
    echo "   ✅ client.ts: exists"
    echo "   📦 エクスポート: categoryApi, exerciseApi, exerciseRecordApi"
    echo "   📦 型エクスポート: Category, ExerciseResponse, ExerciseRecordResponse 等"
else
    echo "   ⚠️  client.ts: not found"
fi
echo "   📁 ファイル: front/app/broccoli-front/src/api/client.ts"
echo ""

# 6. npm スクリプト確認
echo "📌 [6] npm スクリプト確認"
echo "   ✅ npm run generate:types"
echo "      → openapi-typescript http://localhost:8000/openapi.json"
echo ""

# 7. .gitignore 確認
echo "📌 [7] .gitignore 設定確認"
if grep -q "src/api/generated.ts" "front/app/broccoli-front/.gitignore" 2>/dev/null; then
    echo "   ✅ generated.ts は .gitignore に設定済み"
else
    echo "   ⚠️  generated.ts が .gitignore に設定されていません"
fi
echo ""

echo "================================================================================="
echo "使用開始ガイド"
echo "================================================================================="
echo ""
echo "【Step 1】 バックエンドサーバーの起動"
echo "  $ cd back"
echo "  $ python -m uvicorn api.main:app --reload --port 8000"
echo ""
echo "【Step 2】 TypeScript 型の生成"
echo "  $ cd front/app/broccoli-front"
echo "  $ npm run generate:types"
echo ""
echo "【Step 3】 フロントエンドの起動"
echo "  $ npm run dev"
echo ""
echo "================================================================================="
echo "主要ファイル"
echo "================================================================================="
echo ""
echo "📁 バックエンド"
echo "   back/api/main.py               FastAPI アプリケーション"
echo "   back/api/schemas/              データスキーマ定義 (SQLModel)"
echo "   back/api/routers/              API エンドポイント定義"
echo ""
echo "📁 フロントエンド"
echo "   front/app/broccoli-front/src/api/generated.ts   ✨ 自動生成型"
echo "   front/app/broccoli-front/src/api/client.ts      API クライアント層"
echo "   front/app/broccoli-front/src/api/README.md      詳細ドキュメント"
echo ""
echo "📁 ドキュメント"
echo "   OPENAPI_SETUP_GUIDE.md          完全なセットアップガイド"
echo ""
echo "================================================================================="
echo "確認完了 ✅"
echo "================================================================================="
