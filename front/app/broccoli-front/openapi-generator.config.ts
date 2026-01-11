/**
 * OpenAPI TypeScript 型生成設定
 * 
 * 使用方法:
 * npm run generate:types
 */

const config = {
  // OpenAPI スキーマの取得元
  // 開発環境ではローカルサーバーから、本番環境では公開 URL から取得
  input:
    process.env.OPENAPI_URL || "http://localhost:8000/openapi.json",
  output: "src/api/generated.ts",
};

export default config;
