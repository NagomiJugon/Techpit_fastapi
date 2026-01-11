/**
 * サンプル実装: Category 管理コンポーネント
 * 
 * このコンポーネントは、OpenAPI で自動生成された型を使用して、
 * 完全に型安全な実装を行う例を示します。
 * 
 * 用途: このファイルは参考実装です。
 *       src/components に実際のコンポーネントを実装する際に参考にしてください。
 */

import React, { useEffect, useState, useCallback } from 'react';
import { categoryApi, type Category, type CategoryCreate } from '@src/api/client';

/**
 * Category 管理コンポーネント
 * 
 * - 完全に型安全な API 呼び出し
 * - エラーハンドリング
 * - ローディング状態の管理
 */
export const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CategoryCreate>({ name: '' });

  /**
   * カテゴリー一覧を取得
   */
  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryApi.list();
      // TypeScript は data が Category[] であることを自動認識
      setCategories(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * コンポーネント マウント時にカテゴリーを取得
   */
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  /**
   * カテゴリーを作成
   */
  const handleCreate = async (data: CategoryCreate) => {
    try {
      setLoading(true);
      // TypeScript は CategoryCreate を要求し、
      // レスポンスが CategoryCreateResponse であることを保証
      const response = await categoryApi.create(data);
      
      // レスポンスから新しいカテゴリー情報を取得して状態を更新
      setCategories(prev => [...prev, response as unknown as Category]);
      setFormData({ name: '' });
      setIsEditing(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * カテゴリーを更新
   */
  const handleUpdate = async (categoryId: number, data: CategoryCreate) => {
    try {
      setLoading(true);
      // TypeScript は categoryId が number であることを要求
      // data が CategoryCreate であることを要求
      // レスポンスが CategoryCreateResponse であることを保証
      const response = await categoryApi.update(categoryId, data);
      
      // 状態を更新
      setCategories(prev =>
        prev.map(cat =>
          cat.id === categoryId
            ? { ...cat, ...response }
            : cat
        )
      );
      setEditingId(null);
      setIsEditing(false);
      setFormData({ name: '' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * カテゴリーを削除
   */
  const handleDelete = async (categoryId: number) => {
    if (!window.confirm('本当に削除しますか？')) return;

    try {
      setLoading(true);
      // TypeScript は categoryId が number であることを要求
      // 戻り値が void であることを保証
      await categoryApi.delete(categoryId);
      
      // 状態を更新
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * フォーム送信時の処理
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // フォーム検証
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (editingId !== null) {
      handleUpdate(editingId, formData);
    } else {
      handleCreate(formData);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>

      {/* エラーメッセージ */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button
            className="ml-2 text-sm underline"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* フォーム */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Category Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData({ name: e.target.value })}
            placeholder="Enter category name"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : isEditing ? 'Update' : 'Create'}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setEditingId(null);
              setFormData({ name: '' });
            }}
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
        )}
      </form>

      {/* カテゴリー一覧 */}
      {loading && categories.length === 0 && (
        <p className="text-gray-500">Loading...</p>
      )}

      {categories.length === 0 && !loading && (
        <p className="text-gray-500">No categories found</p>
      )}

      <ul className="space-y-2">
        {categories.map(category => (
          <li
            key={category.id}
            className="flex items-center justify-between p-4 bg-white border rounded"
          >
            <span>{category.name}</span>
            <div className="space-x-2">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setEditingId(category.id);
                  setFormData({ name: category.name });
                }}
                disabled={loading}
                className="px-3 py-1 bg-yellow-500 text-white rounded text-sm disabled:opacity-50"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                disabled={loading}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManager;
