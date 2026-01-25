import React, { useEffect, useState, useReducer } from 'react';
import { MainLayout } from '@src/layouts/MainLayout/MainLayout';
import { Content } from '@src/components/Content/Content';
import axios from 'axios';
import { API_URL, ActionTypes } from '@src/utils/constants';
import type { components } from '@src/api/generated';
import { categoryReducer, initialState as CategoryReducerIS } from '@src/reducers/categoryReducer';

type Exercise = components['schemas']['ExerciseResponse'];
type Category = components['schemas']['Category'];

export const ExerciseManagement = () => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [categoriesState, categoryDispatch] = useReducer(categoryReducer, CategoryReducerIS);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [editCategoryId, setEditCategoryId] = useState<number>(0);
    const [newExerciseName, setNewExerciseName] = useState('');
    const [newExerciseCategoryId, setNewExerciseCategoryId] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);

    // 初期データ取得
    useEffect(() => {
        fetchCategories();
        fetchExercises();
    }, []);

    const fetchCategories = async () => {
        categoryDispatch({ type: ActionTypes.fetch });
        try {
            const response = await axios.get<Category[]>(`${API_URL}/categories/assigned`);
            categoryDispatch({ type: ActionTypes.success, payload: response.data });
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            categoryDispatch({ type: ActionTypes.error });
        }
    };

    const fetchExercises = async () => {
        try {
            const response = await axios.get<Exercise[]>(`${API_URL}/exercises`);
            setExercises(response.data);
        } catch (error) {
            console.error('Failed to fetch exercises:', error);
            alert('トレーニング種別の読み込みに失敗しました');
        }
    };

    const handleAddExercise = async () => {
        if (!newExerciseName.trim()) {
            alert('トレーニング種別名を入力してください');
            return;
        }
        if (newExerciseCategoryId === 0) {
            alert('カテゴリーを選択してください');
            return;
        }
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/exercises`, {
                name: newExerciseName,
                category_id: newExerciseCategoryId,
            });
            setExercises([...exercises, response.data]);
            setNewExerciseName('');
            setNewExerciseCategoryId(0);
            alert('トレーニング種別を追加しました');
        } catch (error) {
            console.error('Failed to add exercise:', error);
            alert('トレーニング種別の追加に失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartEdit = (exercise: Exercise) => {
        setEditingId(exercise.id);
        setEditName(exercise.name);
        setEditCategoryId(exercise.category_id || 0);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditName('');
        setEditCategoryId(0);
    };

    const handleSaveEdit = async (id: number) => {
        if (!editName.trim()) {
            alert('トレーニング種別名を入力してください');
            return;
        }
        if (editCategoryId === 0) {
            alert('カテゴリーを選択してください');
            return;
        }
        setIsLoading(true);
        try {
            const response = await axios.put(`${API_URL}/exercises/${id}`, {
                name: editName,
                category_id: editCategoryId,
            });
            setExercises(exercises.map((ex) => (ex.id === id ? response.data : ex)));
            setEditingId(null);
            setEditName('');
            setEditCategoryId(0);
            alert('トレーニング種別を更新しました');
        } catch (error) {
            console.error('Failed to update exercise:', error);
            alert('トレーニング種別の更新に失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteExercise = async (id: number) => {
        if (!confirm('このトレーニング種別を削除してもよろしいですか?')) {
            return;
        }
        setIsLoading(true);
        try {
            await axios.delete(`${API_URL}/exercises/${id}`);
            setExercises(exercises.filter((ex) => ex.id !== id));
            alert('トレーニング種別を削除しました');
        } catch (error) {
            console.error('Failed to delete exercise:', error);
            alert('トレーニング種別の削除に失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainLayout>
            <Content>
                <div className="bg-white dark:bg-neutral-800 shadow-md rounded px-8 pt-6 pb-8 w-full">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-200 mb-6">
                        トレーニング種別管理
                    </h1>

                    {/* 追加フォーム */}
                    <div className="mb-8 p-4 border border-gray-200 dark:border-neutral-700 rounded">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200 mb-4">
                            新しいトレーニング種別を追加
                        </h2>
                        <div className="flex gap-2 flex-wrap">
                            <select
                                value={newExerciseCategoryId}
                                onChange={(e) => setNewExerciseCategoryId(Number(e.target.value))}
                                className="shadow appearance-none border rounded py-2 px-3 border-gray-400 dark:border-neutral-600 text-gray-700 dark:text-neutral-200 bg-white dark:bg-neutral-700 leading-tight focus:outline-none focus:shadow-outline"
                                disabled={isLoading}
                            >
                                <option value={0}>カテゴリーを選択</option>
                                {categoriesState.categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                value={newExerciseName}
                                onChange={(e) => setNewExerciseName(e.target.value)}
                                placeholder="トレーニング種別名を入力"
                                className="flex-1 shadow appearance-none border rounded py-2 px-3 border-gray-400 dark:border-neutral-600 text-gray-700 dark:text-neutral-200 bg-white dark:bg-neutral-700 leading-tight focus:outline-none focus:shadow-outline"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleAddExercise}
                                disabled={isLoading}
                                className="bg-green-500 opacity-75 hover:opacity-100 disabled:opacity-50 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                追加
                            </button>
                        </div>
                    </div>

                    {/* トレーニング種別一覧 */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-200 dark:border-neutral-700">
                            <thead className="bg-gray-100 dark:bg-neutral-700">
                                <tr>
                                    <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-left text-gray-800 dark:text-neutral-200">
                                        ID
                                    </th>
                                    <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-left text-gray-800 dark:text-neutral-200">
                                        トレーニング種別名
                                    </th>
                                    <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-left text-gray-800 dark:text-neutral-200">
                                        カテゴリー
                                    </th>
                                    <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center text-gray-800 dark:text-neutral-200">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {exercises.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center text-gray-500 dark:text-neutral-400">
                                            トレーニング種別がありません
                                        </td>
                                    </tr>
                                ) : (
                                    exercises.map((exercise) => (
                                        <tr key={exercise.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                                            <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-gray-800 dark:text-neutral-200">
                                                {exercise.id}
                                            </td>
                                            <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2">
                                                {editingId === exercise.id ? (
                                                    <input
                                                        type="text"
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        className="w-full shadow appearance-none border rounded py-1 px-2 border-gray-400 dark:border-neutral-600 text-gray-700 dark:text-neutral-200 bg-white dark:bg-neutral-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        disabled={isLoading}
                                                    />
                                                ) : (
                                                    <span className="text-gray-800 dark:text-neutral-200">
                                                        {exercise.name}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2">
                                                {editingId === exercise.id ? (
                                                    <select
                                                        value={editCategoryId}
                                                        onChange={(e) => setEditCategoryId(Number(e.target.value))}
                                                        className="w-full shadow appearance-none border rounded py-1 px-2 border-gray-400 dark:border-neutral-600 text-gray-700 dark:text-neutral-200 bg-white dark:bg-neutral-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        disabled={isLoading}
                                                    >
                                                        <option value={0}>カテゴリーを選択</option>
                                                        {categoriesState.categories.map((cat) => (
                                                            <option key={cat.id} value={cat.id}>
                                                                {cat.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span className="text-gray-800 dark:text-neutral-200">
                                                        {categoriesState.categories.find(c => c.id === exercise.category_id)?.name || 'N/A'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center">
                                                {editingId === exercise.id ? (
                                                    <div className="flex gap-2 justify-center">
                                                        <button
                                                            onClick={() => handleSaveEdit(exercise.id)}
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
                                                            onClick={() => handleStartEdit(exercise)}
                                                            disabled={isLoading}
                                                            className="bg-yellow-500 opacity-75 hover:opacity-100 disabled:opacity-50 text-white font-bold py-1 px-3 rounded text-sm"
                                                        >
                                                            編集
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteExercise(exercise.id)}
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
