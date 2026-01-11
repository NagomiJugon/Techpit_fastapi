/**
 * OpenAPI 型生成システム導入ガイド
 * 
 * このドキュメントは、OpenAPI → TypeScript 型の自動生成システムの
 * セットアップと使用方法を説明します。
 * 
 * ============================================================================
 * 【概要】
 * ============================================================================
 * 
 * このプロジェクトでは、FastAPI が生成する OpenAPI スキーマから
 * TypeScript 型を自動生成し、一元管理します。
 * 
 * 【利点】
 * - 型の二重管理を排除
 * - API 仕様変更が自動的に TypeScript 型に反映
 * - バックエンド・フロントエンド間の型の不整合を防止
 * - 開発効率の向上と保守性の向上
 * 
 * ============================================================================
 * 【セットアップ済みの内容】
 * ============================================================================
 * 
 * 1. バックエンド (FastAPI)
 *    - main.py で OpenAPI メタデータを設定
 *    - /openapi.json エンドポイントが自動生成
 * 
 * 2. フロントエンド (React + TypeScript)
 *    - package.json に openapi-typescript をインストール
 *    - npm run generate:types コマンドで型生成
 *    - src/api/generated.ts に全型定義が自動生成
 * 
 * 3. API クライアント層
 *    - src/api/client.ts で API メソッドと型をエクスポート
 *    - 全メソッドに型安全性を確保
 * 
 * ============================================================================
 * 【使用方法】
 * ============================================================================
 * 
 * ──── 1. バックエンド API サーバーの起動
 * 
 *   cd /home/fsato/fast-api/broccoli/back
 *   python -m uvicorn api.main:app --reload --port 8000
 * 
 * ──── 2. TypeScript 型の生成
 * 
 *   cd /home/fsato/fast-api/broccoli/front/app/broccoli-front
 *   npm run generate:types
 * 
 *   実行結果:
 *   ✨ openapi-typescript 7.10.1
 *   🚀 http://localhost:8000/openapi.json → src/api/generated.ts
 * 
 * ──── 3. コンポーネントで型付き API を使用
 * 
 *   // src/components/ExerciseList.tsx
 *   import { exerciseApi, type ExerciseResponse } from '@src/api/client';
 *   
 *   export const ExerciseList: React.FC = () => {
 *     const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
 *     
 *     useEffect(() => {
 *       exerciseApi.list().then(setExercises).catch(console.error);
 *     }, []);
 *     
 *     return (
 *       <ul>
 *         {exercises.map(exercise => (
 *           <li key={exercise.id}>{exercise.name}</li>
 *         ))}
 *       </ul>
 *     );
 *   };
 * 
 * ============================================================================
 * 【型の使用方法】
 * ============================================================================
 * 
 * ──── API レスポンス型
 * 
 *   import type {
 *     Category,
 *     ExerciseResponse,
 *     ExerciseRecordResponse,
 *     ExerciseCreate,
 *     ExerciseRecordCreate,
 *   } from '@src/api/client';
 * 
 * ──── API メソッド
 * 
 *   import { categoryApi, exerciseApi, exerciseRecordApi } from '@src/api/client';
 *   
 *   // Category
 *   await categoryApi.list();                    // Category[]
 *   await categoryApi.listAssigned();            // Category[]
 *   await categoryApi.get(id);                   // Category | null
 *   await categoryApi.create(data);              // CategoryCreateResponse
 *   await categoryApi.update(id, data);          // CategoryCreateResponse
 *   await categoryApi.delete(id);                // void
 *   
 *   // Exercise
 *   await exerciseApi.list();                    // ExerciseResponse[]
 *   await exerciseApi.get(id);                   // ExerciseResponse
 *   await exerciseApi.getByCategory(categoryId); // ExerciseResponse[]
 *   await exerciseApi.create(data);              // ExerciseResponse
 *   await exerciseApi.update(id, data);          // ExerciseResponse
 *   await exerciseApi.delete(id);                // void
 *   
 *   // ExerciseRecord
 *   await exerciseRecordApi.list();              // ExerciseRecordResponse[]
 *   await exerciseRecordApi.create(data);        // ExerciseRecordResponse
 * 
 * ============================================================================
 * 【ワークフロー】
 * ============================================================================
 * 
 * 【Step 1】 バックエンド API を開発
 * 
 *   FastAPI の schemas, routers を編集
 *   →  OpenAPI スキーマが自動更新
 * 
 * 【Step 2】 型を再生成
 * 
 *   npm run generate:types
 *   →  TypeScript 型が最新仕様に更新
 * 
 * 【Step 3】 フロントエンド開発
 * 
 *   import してコンポーネントを実装
 *   →  TypeScript が最新仕様に基づいて型チェック
 * 
 * ============================================================================
 * 【トラブルシューティング】
 * ============================================================================
 * 
 * ──── Q1: npm run generate:types が失敗する
 * 
 *   A: バックエンド API サーバーが起動していることを確認
 *      cd back && python -m uvicorn api.main:app --reload --port 8000
 * 
 * ──── Q2: generated.ts が古い情報を含んでいる
 * 
 *   A: API スキーマのキャッシュをクリアして再生成
 *      rm src/api/generated.ts && npm run generate:types
 * 
 * ──── Q3: 環境変数 VITE_API_BASE_URL を設定したい
 * 
 *   A: .env ファイルで設定
 *      VITE_API_BASE_URL=https://api.example.com
 *      
 *      クライアントコードでは自動的に使用されます:
 *      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
 *                             || 'http://localhost:8000';
 * 
 * ============================================================================
 * 【ファイル構成】
 * ============================================================================
 * 
 * front/app/broccoli-front/
 * ├── src/
 * │   ├── api/
 * │   │   ├── generated.ts          ← 自動生成（.gitignore に追加）
 * │   │   └── client.ts             ← API クライアント層（手動作成）
 * │   ├── types/
 * │   │   ├── category.ts           ← 削除可（generated.ts が代替）
 * │   │   ├── exercise.ts           ← 削除可（generated.ts が代替）
 * │   │   └── exerciseRecord.ts     ← 削除可（generated.ts が代替）
 * │   └── ... (コンポーネント等)
 * │
 * └── package.json
 *     └── scripts:
 *         └── generate:types        ← 型生成コマンド
 * 
 * ============================================================================
 * 【OpenAPI 仕様の確認】
 * ============================================================================
 * 
 * ブラウザで以下にアクセスして OpenAPI スキーマを確認:
 * 
 *   http://localhost:8000/openapi.json      (JSON)
 *   http://localhost:8000/docs               (Swagger UI)
 *   http://localhost:8000/redoc              (ReDoc)
 * 
 * ============================================================================
 * 【ベストプラクティス】
 * ============================================================================
 * 
 * 1. API コール時は常に client.ts を通じて呼び出す
 * 2. generated.ts は編集しない（自動生成ファイル）
 * 3. API スキーマ変更後は必ず npm run generate:types を実行
 * 4. src/types/ 配下の手動定義型は削除し、
 *    client.ts の型エクスポートを使用する
 * 5. 環境別の API ベース URL は環境変数で管理
 * 
 * ============================================================================
 */

// このファイルは型生成の説明用です。削除しても問題ありません。
export {};
