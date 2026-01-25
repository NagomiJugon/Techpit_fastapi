import React, { useEffect, useState } from 'react';
import { MainLayout } from '@src/layouts/MainLayout/MainLayout';
import { Content } from '@src/components/Content/Content';
import axios from 'axios';
import { API_URL } from '@src/utils/constants';
import type { components } from '@src/api/generated';

type ExerciseRecord = components['schemas']['ExerciseRecordResponse'];
type Category = components['schemas']['Category'];
type Exercise = components['schemas']['ExerciseResponse'];

export const History = () => {
    const [records, setRecords] = useState<ExerciseRecord[]>([]);
    const [filteredRecords, setFilteredRecords] = useState<ExerciseRecord[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<number>(0);
    const [selectedExercise, setSelectedExercise] = useState<number>(0);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    useEffect(() => {
        fetchRecords();
        fetchCategories();
        fetchExercises();
    }, []);

    // 初回データ取得後のみフィルタリング
    useEffect(() => {
        if (records.length > 0) {
            setFilteredRecords(records);
        } else {
            setFilteredRecords([]);
        }
    }, [records]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get<Category[]>(`${API_URL}/categories/assigned`);
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchExercises = async () => {
        try {
            const response = await axios.get<Exercise[]>(`${API_URL}/exercises`);
            setExercises(response.data);
        } catch (error) {
            console.error('Failed to fetch exercises:', error);
        }
    };

    const fetchRecords = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get<ExerciseRecord[]>(`${API_URL}/exercise_records`);
            console.log('Fetched records:', response.data);
            setRecords(response.data);
        } catch (error) {
            console.error('Failed to fetch records:', error);
            alert('記録の読み込みに失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = () => {
        console.log('Applying filters:', { selectedCategory, selectedExercise, startDate, endDate });
        console.log('Total records:', records.length);
        applyFilters();
    };

    const applyFilters = () => {
        let filtered = [...records];
        console.log('Before filter:', filtered.length);

        // カテゴリーフィルター
        if (selectedCategory !== 0) {
            filtered = filtered.filter(record => record.exercise?.category?.id === selectedCategory);
            console.log('After category filter:', filtered.length);
        }

        // 種目フィルター
        if (selectedExercise !== 0) {
            filtered = filtered.filter(record => record.exercise_id === selectedExercise);
            console.log('After exercise filter:', filtered.length);
        }

        // 日付フィルター
        if (startDate) {
            filtered = filtered.filter(record => {
                const recordDate = record.exercise_date || '';
                console.log(`Comparing recordDate: ${recordDate} >= startDate: ${startDate} = ${recordDate >= startDate}`);
                return recordDate >= startDate;
            });
            console.log('After start date filter:', filtered.length);
        }

        if (endDate) {
            filtered = filtered.filter(record => {
                const recordDate = record.exercise_date || '';
                console.log(`Comparing recordDate: ${recordDate} <= endDate: ${endDate} = ${recordDate <= endDate}`);
                return recordDate <= endDate;
            });
            console.log('After end date filter:', filtered.length);
        }

        console.log('Final filtered:', filtered.length);
        setFilteredRecords(filtered);
    };

    const handleDeleteRecord = async (recordId: number) => {
        if (!confirm('この記録を削除してもよろしいですか？')) return;

        try {
            await axios.delete(`${API_URL}/exercise_records/${recordId}`);
            alert('記録を削除しました');
            fetchRecords();
        } catch (error) {
            console.error('Failed to delete record:', error);
            alert('記録の削除に失敗しました');
        }
    };

    const resetFilters = () => {
        setSelectedCategory(0);
        setSelectedExercise(0);
        setStartDate('');
        setEndDate('');
        setFilteredRecords(records);
    };

    // カテゴリーに応じて種目をフィルタリング
    const filteredExercises = selectedCategory === 0
        ? exercises
        : exercises.filter(ex => ex.category_id === selectedCategory);

    // カテゴリー変更時に種目選択をリセット
    const handleCategoryChange = (categoryId: number) => {
        setSelectedCategory(categoryId);
        setSelectedExercise(0);
    };

    return (
        <MainLayout>
            <Content>
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-neutral-200">
                        トレーニング履歴
                    </h1>

                    {/* フィルターセクション */}
                    <div className="bg-white dark:bg-neutral-800 shadow-md rounded px-6 py-4 mb-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-neutral-200">
                            フィルター
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* カテゴリー選択 */}
                            <div>
                                <label className="block text-gray-700 dark:text-neutral-200 text-sm font-bold mb-2">
                                    カテゴリー
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => handleCategoryChange(Number(e.target.value))}
                                    className="block w-full bg-white dark:bg-neutral-700 border border-gray-400 dark:border-neutral-600 rounded py-2 px-3 text-gray-800 dark:text-neutral-200 leading-tight focus:outline-none focus:shadow-outline">
                                    <option value={0}>すべて</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 種目選択 */}
                            <div>
                                <label className="block text-gray-700 dark:text-neutral-200 text-sm font-bold mb-2">
                                    種目
                                </label>
                                <select
                                    value={selectedExercise}
                                    onChange={(e) => setSelectedExercise(Number(e.target.value))}
                                    className="block w-full bg-white dark:bg-neutral-700 border border-gray-400 dark:border-neutral-600 rounded py-2 px-3 text-gray-800 dark:text-neutral-200 leading-tight focus:outline-none focus:shadow-outline">
                                    <option value={0}>すべて</option>
                                    {filteredExercises.map(ex => (
                                        <option key={ex.id} value={ex.id}>
                                            {ex.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 開始日 */}
                            <div>
                                <label className="block text-gray-700 dark:text-neutral-200 text-sm font-bold mb-2">
                                    開始日
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="block w-full bg-white dark:bg-neutral-700 border border-gray-400 dark:border-neutral-600 rounded py-2 px-3 text-gray-800 dark:text-neutral-200 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>

                            {/* 終了日 */}
                            <div>
                                <label className="block text-gray-700 dark:text-neutral-200 text-sm font-bold mb-2">
                                    終了日
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="block w-full bg-white dark:bg-neutral-700 border border-gray-400 dark:border-neutral-600 rounded py-2 px-3 text-gray-800 dark:text-neutral-200 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={resetFilters}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                リセット
                            </button>
                            <button
                                onClick={handleSearch}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                検索
                            </button>
                        </div>
                    </div>

                    {/* 記録一覧テーブル */}
                    <div className="bg-white dark:bg-neutral-800 shadow-md rounded overflow-hidden">
                        {isLoading ? (
                            <div className="p-8 text-center text-gray-500 dark:text-neutral-400">
                                読み込み中...
                            </div>
                        ) : records.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 dark:text-neutral-400">
                                データがありません
                            </div>
                        ) : filteredRecords.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 dark:text-neutral-400">
                                検索条件に一致する記録が見つかりませんでした
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                                    <thead className="bg-gray-50 dark:bg-neutral-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                                                日付
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                                                カテゴリー
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                                                種目
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                                                重量 (kg)
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                                                回数
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                                                操作
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
                                        {filteredRecords.map((record) => (
                                            <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                                    {record.exercise_date || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                                    {record.exercise?.category?.name || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                                    {record.exercise?.name || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                                    {record.weight}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                                    {record.rep}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button
                                                        onClick={() => handleDeleteRecord(record.id)}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-medium">
                                                        削除
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* 統計情報 */}
                    <div className="mt-6 bg-white dark:bg-neutral-800 shadow-md rounded px-6 py-4">
                        <p className="text-sm text-gray-600 dark:text-neutral-400">
                            合計: <span className="font-bold text-gray-800 dark:text-neutral-200">{filteredRecords.length}</span> 件
                        </p>
                    </div>
                </div>
            </Content>
        </MainLayout>
    );
};
