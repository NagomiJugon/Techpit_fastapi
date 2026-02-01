/**
 * API クライアント層
 * 
 * OpenAPI generated.ts をラップして、使いやすい API メソッドを提供します。
 * このレイヤーを通じてすべての API 呼び出しを行うことで、
 * 型安全性を確保しながら API 仕様の変更に自動で対応できます。
 */

import type { components, paths } from "./generated";

// Docker環境対応: 環境変数で指定されたURLを使用、なければlocalhost:8000を使用
const API_BASE_URL = (() => {
  // 環境変数でAPI_BASE_URLが指定されていたら、その値を使用（Docker環境での正しいホスト名など）
  if (import.meta.env.VITE_API_BASE_URL) {
    console.log('API_BASE_URL from VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
    return import.meta.env.VITE_API_BASE_URL;
  }
  // デフォルトはホストマシンのlocalhost:8000
  const defaultUrl = "http://localhost:8000";
  console.log('API_BASE_URL from default:', defaultUrl);
  return defaultUrl;
})();

/**
 * 型エイリアスの定義
 * OpenAPI のコンポーネントスキーマをより使いやすい名前で再エクスポート
 */
export type Category = components["schemas"]["Category"];
export type CategoryCreate = components["schemas"]["CategoryCreate"];
export type CategoryCreateResponse = components["schemas"]["CategoryCreateResponse"];
export type ExerciseResponse = components["schemas"]["ExerciseResponse"];
export type ExerciseCreate = components["schemas"]["ExerciseCreate"];
export type ExerciseInRecordResponse =
  components["schemas"]["ExerciseInRecordResponse"];
export type ExerciseRecordResponse =
  components["schemas"]["ExerciseRecordResponse"];
export type ExerciseRecordCreate = components["schemas"]["ExerciseRecordCreate"];

/**
 * APIエラーをハンドルする
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      `API Error: ${response.status} ${response.statusText} - ${JSON.stringify(error)}`
    );
  }
  return response.json() as Promise<T>;
}

/**
 * APIリクエスト共通処理
 */
async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, options);
  return handleResponse<T>(response);
}

/**
 * Category API
 */
export const categoryApi = {
  /**
   * すべてのカテゴリーを取得
   */
  async list(): Promise<Category[]> {
    return request<Category[]>("GET", "/categories");
  },

  /**
   * 割り当てられたカテゴリーを取得
   */
  async listAssigned(): Promise<Category[]> {
    return request<Category[]>("GET", "/categories/assigned");
  },

  /**
   * 特定のカテゴリーを取得
   */
  async get(categoryId: number): Promise<Category | null> {
    return request<Category | null>("GET", `/categories/${categoryId}`);
  },

  /**
   * カテゴリーを作成
   */
  async create(
    data: CategoryCreate
  ): Promise<CategoryCreateResponse> {
    return request<CategoryCreateResponse>("POST", "/categories", data);
  },

  /**
   * カテゴリーを更新
   */
  async update(
    categoryId: number,
    data: CategoryCreate
  ): Promise<CategoryCreateResponse> {
    return request<CategoryCreateResponse>(
      "PUT",
      `/categories/${categoryId}`,
      data
    );
  },

  /**
   * カテゴリーを削除
   */
  async delete(categoryId: number): Promise<void> {
    return request<void>("DELETE", `/categories/${categoryId}`);
  },
};

/**
 * Exercise API
 */
export const exerciseApi = {
  /**
   * すべての種目を取得
   */
  async list(): Promise<ExerciseResponse[]> {
    return request<ExerciseResponse[]>("GET", "/exercises");
  },

  /**
   * 特定の種目を取得
   */
  async get(exerciseId: number): Promise<ExerciseResponse> {
    return request<ExerciseResponse>("GET", `/exercises/${exerciseId}`);
  },

  /**
   * カテゴリーごとの種目を取得
   */
  async getByCategory(categoryId: number): Promise<ExerciseResponse[]> {
    return request<ExerciseResponse[]>(
      "GET",
      `/exercises/category/${categoryId}`
    );
  },

  /**
   * 種目を作成
   */
  async create(data: ExerciseCreate): Promise<ExerciseResponse> {
    return request<ExerciseResponse>("POST", "/exercises", data);
  },

  /**
   * 種目を更新
   */
  async update(
    exerciseId: number,
    data: ExerciseCreate
  ): Promise<ExerciseResponse> {
    return request<ExerciseResponse>(
      "PUT",
      `/exercises/${exerciseId}`,
      data
    );
  },

  /**
   * 種目を削除
   */
  async delete(exerciseId: number): Promise<void> {
    return request<void>("DELETE", `/exercises/${exerciseId}`);
  },
};

/**
 * Exercise Record API
 */
export const exerciseRecordApi = {
  /**
   * すべてのトレーニング記録を取得
   */
  async list(): Promise<ExerciseRecordResponse[]> {
    return request<ExerciseRecordResponse[]>("GET", "/exercise_records");
  },

  /**
   * トレーニング記録を作成
   */
  async create(
    data: ExerciseRecordCreate
  ): Promise<ExerciseRecordResponse> {
    return request<ExerciseRecordResponse>("POST", "/exercise_records", data);
  },
};
