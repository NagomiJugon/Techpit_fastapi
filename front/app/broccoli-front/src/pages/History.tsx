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
    const [totalCount, setTotalCount] = useState<number>(0);
    const [categories, setCategories] = useState<Category[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<number>(0);
    const [selectedExercise, setSelectedExercise] = useState<number>(0);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const ITEMS_PER_PAGE = 100;

    useEffect(() => {
        fetchCategories();
        fetchExercises();
    }, []);


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

    const fetchRecords = async (page: number = 1) => {
        setIsLoading(true);
        try {
            const offset = (page - 1) * ITEMS_PER_PAGE;
            const params: any = {
                limit: ITEMS_PER_PAGE,
                offset: offset
            };

            // 日付フィルターはバックエンドで対応していないため、フロントエンドでフィルタリングする
            // まず全件数を取得
            const countResponse = await axios.get<{ count: number }>(`${API_URL}/exercise_records/count`);
            const allRecords = await axios.get<ExerciseRecord[]>(`${API_URL}/exercise_records`);
            
            let filtered = allRecords.data;
            
            // クライアントサイドフィルタリング
            if (selectedCategory !== 0) {
                filtered = filtered.filter(record => record.exercise?.category?.id === selectedCategory);
            }
            if (selectedExercise !== 0) {
                filtered = filtered.filter(record => record.exercise_id === selectedExercise);
            }
            if (startDate) {
                filtered = filtered.filter(record => (record.exercise_date || '') >= startDate);
            }
            if (endDate) {
                filtered = filtered.filter(record => (record.exercise_date || '') <= endDate);
            }
            
            // ページネーション
            const start = (page - 1) * ITEMS_PER_PAGE;
            const paginatedData = filtered.slice(start, start + ITEMS_PER_PAGE);
            
            setTotalCount(filtered.length);
            setFilteredRecords(paginatedData);
        } catch (error) {
            console.error('Failed to fetch records:', error);
            alert('記録の読み込みに失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchRecords(1);
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
        setCurrentPage(1);
        setFilteredRecords([]);
        setTotalCount(0);
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

    // ページネーション計算
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalCount);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchRecords(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1);
        }
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
                        ) : totalCount === 0 ? (
                            <div className="p-8 text-center text-gray-500 dark:text-neutral-400">
                                検索ボタンを押して検索してください
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

                    {/* ページネーション */}
                    {!isLoading && totalCount > 0 && totalPages > 1 && (
                        <div className="mt-6 bg-white dark:bg-neutral-800 shadow-md rounded px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600 dark:text-neutral-400">
                                    {startIndex + 1} - {endIndex} 件 / 全 {totalCount} 件
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-neutral-200 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded hover:bg-gray-50 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed">
                                        前へ
                                    </button>
                                    
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }
                                            
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`px-3 py-2 text-sm font-medium rounded ${
                                                        currentPage === pageNum
                                                            ? 'bg-blue-500 text-white'
                                                            : 'text-gray-700 dark:text-neutral-200 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-600'
                                                    }`}>
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    
                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-neutral-200 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded hover:bg-gray-50 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed">
                                        次へ
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 統計情報 */}
                    <div className="mt-6 bg-white dark:bg-neutral-800 shadow-md rounded px-6 py-4">
                        <p className="text-sm text-gray-600 dark:text-neutral-400">
                            合計: <span className="font-bold text-gray-800 dark:text-neutral-200">{totalCount}</span> 件
                            {totalCount > ITEMS_PER_PAGE && (
                                <span className="ml-2">
                                    (ページ {currentPage} / {totalPages})
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </Content>
        </MainLayout>
    );
};
