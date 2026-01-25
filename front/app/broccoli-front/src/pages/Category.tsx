import React, { useEffect, useState } from 'react';
import { MainLayout } from '@src/layouts/MainLayout/MainLayout';
import { Content } from '@src/components/Content/Content';
import axios from 'axios';
import { API_URL } from '@src/utils/constants';
import type { components } from '@src/api/generated';

type Category = components['schemas']['Category'];

export const CategoryManagement = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 初期データ取得
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get<Category[]>(`${API_URL}/categories/assigned`);
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            alert('カテゴリーの読み込みに失敗しました');
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) {
            alert('カテゴリー名を入力してください');
            return;
        }
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/categories`, {
                name: newCategoryName,
            });
            setCategories([...categories, response.data]);
            setNewCategoryName('');
            alert('カテゴリーを追加しました');
        } catch (error) {
            console.error('Failed to add category:', error);
            alert('カテゴリーの追加に失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartEdit = (category: Category) => {
        setEditingId(category.id);
        setEditName(category.name);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditName('');
    };

    const handleSaveEdit = async (id: number) => {
        if (!editName.trim()) {
            alert('カテゴリー名を入力してください');
            return;
        }
        setIsLoading(true);
        try {
            const response = await axios.put(`${API_URL}/categories/${id}`, {
                name: editName,
            });
            setCategories(
                categories.map((cat) => (cat.id === id ? response.data : cat))
            );
            setEditingId(null);
            setEditName('');
            alert('カテゴリーを更新しました');
        } catch (error) {
            console.error('Failed to update category:', error);
            alert('カテゴリーの更新に失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!confirm('このカテゴリーを削除してもよろしいですか?')) {
            return;
        }
        setIsLoading(true);
        try {
            await axios.delete(`${API_URL}/categories/${id}`);
            setCategories(categories.filter((cat) => cat.id !== id));
            alert('カテゴリーを削除しました');
        } catch (error) {
            console.error('Failed to delete category:', error);
            alert('カテゴリーの削除に失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainLayout>
            <Content>
                <div className="bg-white dark:bg-neutral-800 shadow-md rounded px-8 pt-6 pb-8 w-full">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-200 mb-6">
                        カテゴリー管理
                    </h1>

                    {/* 追加フォーム */}
                    <div className="mb-8 p-4 border border-gray-200 dark:border-neutral-700 rounded">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200 mb-4">
                            新しいカテゴリーを追加
                        </h2>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="カテゴリー名を入力"
                                className="flex-1 shadow appearance-none border rounded py-2 px-3 border-gray-400 dark:border-neutral-600 text-gray-700 dark:text-neutral-200 bg-white dark:bg-neutral-700 leading-tight focus:outline-none focus:shadow-outline"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleAddCategory}
                                disabled={isLoading}
                                className="bg-green-500 opacity-75 hover:opacity-100 disabled:opacity-50 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                追加
                            </button>
                        </div>
                    </div>

                    {/* カテゴリー一覧 */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-200 dark:border-neutral-700">
                            <thead className="bg-gray-100 dark:bg-neutral-700">
                                <tr>
                                    <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-left text-gray-800 dark:text-neutral-200">
                                        ID
                                    </th>
                                    <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-left text-gray-800 dark:text-neutral-200">
                                        カテゴリー名
                                    </th>
                                    <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center text-gray-800 dark:text-neutral-200">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center text-gray-500 dark:text-neutral-400">
                                            カテゴリーがありません
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map((category) => (
                                        <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                                            <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-gray-800 dark:text-neutral-200">
                                                {category.id}
                                            </td>
                                            <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2">
                                                {editingId === category.id ? (
                                                    <input
                                                        type="text"
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        className="w-full shadow appearance-none border rounded py-1 px-2 border-gray-400 dark:border-neutral-600 text-gray-700 dark:text-neutral-200 bg-white dark:bg-neutral-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        disabled={isLoading}
                                                    />
                                                ) : (
                                                    <span className="text-gray-800 dark:text-neutral-200">
                                                        {category.name}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center">
                                                {editingId === category.id ? (
                                                    <div className="flex gap-2 justify-center">
                                                        <button
                                                            onClick={() => handleSaveEdit(category.id)}
                                                            disabled={isLoading}
                                                            className="bg-blue-500 opacity-75 hover:opacity-100 disabled:opacity-50 text-white font-bold py-1 px-3 rounded text-sm"
                                                        >
                                                            保存
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            disabled={isLoading}
                                                            className="bg-gray-500 opacity-75 hover:opacity-100 disabled:opacity-50 text-white font-bold py-1 px-3 rounded text-sm"
                                                        >
                                                            キャンセル
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-2 justify-center">
                                                        <button
                                                            onClick={() => handleStartEdit(category)}
                                                            disabled={isLoading}
                                                            className="bg-yellow-500 opacity-75 hover:opacity-100 disabled:opacity-50 text-white font-bold py-1 px-3 rounded text-sm"
                                                        >
                                                            編集
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteCategory(category.id)}
                                                            disabled={isLoading}
                                                            className="bg-red-500 opacity-75 hover:opacity-100 disabled:opacity-50 text-white font-bold py-1 px-3 rounded text-sm"
                                                        >
                                                            削除
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Content>
        </MainLayout>
    );
};
