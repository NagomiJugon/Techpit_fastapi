# OpenAPI → TypeScript 型自動生成システム 実装ガイド

## 📋 目次

1. [概要](#概要)
2. [セットアップ済みの内容](#セットアップ済みの内容)
3. [使用開始ガイド](#使用開始ガイド)
4. [API 使用例](#api-使用例)
5. [トラブルシューティング](#トラブルシューティング)
6. [ファイル構成](#ファイル構成)

---

## 概要

このプロジェクトでは、**FastAPI が生成する OpenAPI スキーマから TypeScript 型を自動生成**し、一元管理しています。

### 主な利点

✅ **型の二重管理を排除**
- バックエンド (SQLModel) とフロントエンド (TypeScript) の型定義が一致
- 単一の情報源 (OpenAPI) から型生成

✅ **API 仕様変更が自動的に反映**
- バックエンド API 変更 → OpenAPI スキーマ更新
- `npm run generate:types` → TypeScript 型が最新に

✅ **型安全性の向上**
- API 呼び出しのすべてが完全に型安全
- IDE の自動補完が完璧に機能

✅ **開発効率の向上**
- 型定義ファイルの手動管理が不要
- バグが減り、開発速度が向上

---

## セットアップ済みの内容

### ✅ 1. バックエンド (FastAPI)

```python
# back/api/main.py
from fastapi import FastAPI

app = FastAPI(
    title="Broccoli API",
    description="フィットネス管理アプリケーション API",
    version="0.1.0",
    openapi_url="/openapi.json",
)
```

- `title`, `description`, `version` を設定
- `/openapi.json` エンドポイントが自動生成
- すべての schemas (Category, Exercise, ExerciseRecord など) が自動ドキュメント化

### ✅ 2. フロントエンド (npm パッケージ)

```json
{
  "devDependencies": {
    "openapi-typescript": "^7.10.0"
  },
  "scripts": {
    "generate:types": "openapi-typescript http://localhost:8000/openapi.json -o src/api/generated.ts"
  }
}
```

- `openapi-typescript` v7.10.0 をインストール
- 型生成コマンドが `package.json` に設定済み

### ✅ 3. API クライアント層

```typescript
// src/api/client.ts
export type Category = components["schemas"]["Category"];
export type ExerciseResponse = components["schemas"]["ExerciseResponse"];

export const categoryApi = {
  async list(): Promise<Category[]> { ... },
  async get(id): Promise<Category | null> { ... },
  async create(data): Promise<CategoryCreateResponse> { ... },
  async update(id, data): Promise<CategoryCreateResponse> { ... },
  async delete(id): Promise<void> { ... },
};
```

- すべての API メソッドに型注釈あり
- 環境変数で API ベース URL を管理

---

## 使用開始ガイド

### Step 1: バックエンド API サーバーの起動

```bash
cd /home/fsato/fast-api/broccoli/back
python -m uvicorn api.main:app --reload --port 8000
```

**出力例:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

### Step 2: TypeScript 型の生成

```bash
cd /home/fsato/fast-api/broccoli/front/app/broccoli-front
npm run generate:types
```

**出力例:**
```
✨ openapi-typescript 7.10.1
🚀 http://localhost:8000/openapi.json → src/api/generated.ts [487.2ms]
```

✅ `src/api/generated.ts` が生成されます（831 行）

### Step 3: フロントエンドの起動

```bash
cd /home/fsato/fast-api/broccoli/front/app/broccoli-front
npm run dev
```

---

## API 使用例

### パターン 1: 一覧取得

```typescript
import { exerciseApi, type ExerciseResponse } from '@src/api/client';
import { useEffect, useState } from 'react';

export const ExerciseList: React.FC = () => {
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // 完全に型安全。exerise の型は ExerciseResponse[]
        const data = await exerciseApi.list();
        setExercises(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {exercises.map(exercise => (
        <li key={exercise.id}>
          {exercise.name} (Category ID: {exercise.category_id})
        </li>
      ))}
    </ul>
  );
};
```

### パターン 2: データ作成

```typescript
import { exerciseApi, type ExerciseCreate } from '@src/api/client';

export const CreateExercise: React.FC = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data: ExerciseCreate = {
      name: 'Bench Press',
      category_id: 1,
    };

    try {
      // TypeScript が ExerciseCreate を要求
      // レスポンスが ExerciseResponse であることを保証
      const response = await exerciseApi.create(data);
      console.log('Created:', response.id, response.name);
    } catch (err) {
      console.error('Failed:', err);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
};
```

### パターン 3: データ更新

```typescript
export const UpdateExercise: React.FC<{ id: number }> = ({ id }) => {
  const handleSubmit = async (formData: ExerciseCreate) => {
    try {
      // 第1引数が number であることを要求
      // 第2引数が ExerciseCreate であることを要求
      const response = await exerciseApi.update(id, formData);
      console.log('Updated:', response);
    } catch (err) {
      console.error('Failed:', err);
    }
  };

  return <>...</>;
};
```

### パターン 4: データ削除

```typescript
export const DeleteExercise: React.FC<{ id: number }> = ({ id }) => {
  const handleDelete = async () => {
    try {
      // 戻り値は void
      await exerciseApi.delete(id);
      console.log('Deleted successfully');
    } catch (err) {
      console.error('Failed:', err);
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
};
```

### パターン 5: 関連データ取得

```typescript
export const ExercisesByCategory: React.FC<{ categoryId: number }> = ({
  categoryId,
}) => {
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);

  useEffect(() => {
    const load = async () => {
      // categoryId が number であることを要求
      // 戻り値が ExerciseResponse[] であることを保証
      const data = await exerciseApi.getByCategory(categoryId);
      setExercises(data);
    };

    load();
  }, [categoryId]);

  return (
    <>
      {exercises.map(exercise => (
        <div key={exercise.id}>{exercise.name}</div>
      ))}
    </>
  );
};
```

---

## 型の一覧

### Category 関連

```typescript
import type {
  Category,
  CategoryCreate,
  CategoryCreateResponse,
} from '@src/api/client';

// API メソッド
categoryApi.list();                // Promise<Category[]>
categoryApi.listAssigned();        // Promise<Category[]>
categoryApi.get(id);               // Promise<Category | null>
categoryApi.create(data);          // Promise<CategoryCreateResponse>
categoryApi.update(id, data);      // Promise<CategoryCreateResponse>
categoryApi.delete(id);            // Promise<void>
```

### Exercise 関連

```typescript
import type {
  ExerciseResponse,
  ExerciseCreate,
  ExerciseInRecordResponse,
} from '@src/api/client';

// API メソッド
exerciseApi.list();                // Promise<ExerciseResponse[]>
exerciseApi.get(id);               // Promise<ExerciseResponse>
exerciseApi.getByCategory(id);     // Promise<ExerciseResponse[]>
exerciseApi.create(data);          // Promise<ExerciseResponse>
exerciseApi.update(id, data);      // Promise<ExerciseResponse>
exerciseApi.delete(id);            // Promise<void>
```

### ExerciseRecord 関連

```typescript
import type {
  ExerciseRecordResponse,
  ExerciseRecordCreate,
} from '@src/api/client';

// API メソッド
exerciseRecordApi.list();          // Promise<ExerciseRecordResponse[]>
exerciseRecordApi.create(data);    // Promise<ExerciseRecordResponse>
```

---

## 環境変数の設定

### フロントエンド `.env` ファイル

```env
# 開発環境
VITE_API_BASE_URL=http://localhost:8000

# 本番環境
# VITE_API_BASE_URL=https://api.example.com
```

### 自動読み込み

```typescript
// src/api/client.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
```

---

## トラブルシューティング

### ❌ npm run generate:types が失敗する

**原因**: バックエンド API サーバーが起動していない

**解決策**:
```bash
# ターミナル 1
cd back
python -m uvicorn api.main:app --reload --port 8000

# ターミナル 2
cd front/app/broccoli-front
npm run generate:types
```

### ❌ generated.ts が古い情報を含んでいる

**原因**: API スキーマのキャッシュが残っている

**解決策**:
```bash
# generated.ts を削除して再生成
cd front/app/broccoli-front
rm src/api/generated.ts
npm run generate:types
```

### ❌ TypeScript エラーが出ている

**原因**: generated.ts が生成されていない

**解決策**:
```bash
# 以下を確認
1. API サーバーが http://localhost:8000 で起動しているか
2. npm run generate:types を実行したか
3. src/api/generated.ts が存在するか

# すべてクリアして再実行
npm run generate:types
```

### ❌ CORS エラーが出ている

**原因**: フロントエンドと API サーバーのオリジンが異なる

**解決策**:
```python
# back/api/main.py で CORS が設定されているか確認
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
)
```

---

## ファイル構成

```
broccoli-front/
├── src/
│   ├── api/
│   │   ├── generated.ts              ✨ 自動生成（.gitignore に追加）
│   │   ├── client.ts                 ✏️  API クライアント層（編集可）
│   │   ├── README.md                 📖 詳細ガイド
│   │   └── SAMPLE_IMPLEMENTATION.tsx 📝 実装例
│   │
│   ├── types/
│   │   ├── category.ts               ⚠️  削除推奨（client.ts 型を使用）
│   │   ├── exercise.ts               ⚠️  削除推奨（client.ts 型を使用）
│   │   └── exerciseRecord.ts         ⚠️  削除推奨（client.ts 型を使用）
│   │
│   ├── components/
│   │   └── ...（既存のコンポーネント）
│   │
│   └── main.tsx
│
├── package.json
│   └── scripts:
│       └── generate:types: "openapi-typescript ..."
│
├── openapi-generator.config.ts       ⚙️  型生成設定
└── .gitignore
    └── src/api/generated.ts
```

---

## ワークフロー

```
┌─────────────────────────────────────────────────────────────┐
│ 1. バックエンド API 開発                                       │
│    - SQLModel schemas を編集                                  │
│    - FastAPI routers を編集                                    │
│    - OpenAPI スキーマが自動更新                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. TypeScript 型の再生成                                      │
│    $ npm run generate:types                                   │
│    - /openapi.json から最新スキーマを取得                    │
│    - generated.ts を自動生成                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. フロントエンド開発                                          │
│    - client.ts から型と API メソッドをインポート            │
│    - コンポーネントを実装                                    │
│    - TypeScript が型チェック                                 │
│    - IDE 自動補完で開発効率向上                              │
└─────────────────────────────────────────────────────────────┘
```

---

## ベストプラクティス

✅ **DO**
- `src/api/client.ts` から型と API メソッドをインポート
- API コール時は常に `categoryApi`, `exerciseApi` 等のラッパーを使用
- 新しい API エンドポイント追加時は必ず `npm run generate:types` を実行
- 環境別設定は `.env` ファイルで管理

❌ **DON'T**
- `src/api/generated.ts` を直接編集（自動生成ファイル）
- `src/types/` 配下の手動定義型を使用
- API URL をコンポーネント内にハードコード
- 型定義をコンポーネント内で手動作成

---

## 参考リンク

- [openapi-typescript GitHub](https://github.com/drwpow/openapi-typescript)
- [FastAPI OpenAPI](https://fastapi.tiangolo.com/features/#openapi)
- [OpenAPI 3.1.0 仕様](https://spec.openapis.org/oas/latest.html)

---

**最終更新**: 2026-01-02

