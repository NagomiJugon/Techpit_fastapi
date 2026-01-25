import React, { useEffect, useState } from 'react';
import { MainLayout } from '@src/layouts/MainLayout/MainLayout';
import { Content } from '@src/components/Content/Content';
import axios from 'axios';
import { API_URL } from '@src/utils/constants';
import type { components } from '@src/api/generated';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

type ExerciseRecord = components['schemas']['ExerciseRecordResponse'];

interface DashboardStats {
    totalWorkoutDays: number;
    totalSets: number;
    thisMonthDays: number;
    thisWeekDays: number;
}

export const Dashboard = () => {
    const [records, setRecords] = useState<ExerciseRecord[]>([]);
    const [stats, setStats] = useState<DashboardStats>({
        totalWorkoutDays: 0,
        totalSets: 0,
        thisMonthDays: 0,
        thisWeekDays: 0,
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get<ExerciseRecord[]>(`${API_URL}/exercise_records`);
            const data = response.data;
            setRecords(data);
            calculateStats(data);
        } catch (error) {
            console.error('Failed to fetch records:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateStats = (data: ExerciseRecord[]) => {
        const today = new Date();
        const thisMonth = today.getMonth();
        const thisYear = today.getFullYear();
        
        // 今週の開始日（日曜日）を取得
        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(today.getDate() - today.getDay());
        thisWeekStart.setHours(0, 0, 0, 0);

        // ユニークな日付を取得
        const uniqueDates = new Set(data.map(r => r.exercise_date));
        const totalWorkoutDays = uniqueDates.size;

        // 今月のトレーニング日数
        const thisMonthDates = new Set(
            data
                .filter(r => {
                    const date = new Date(r.exercise_date || '');
                    return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
                })
                .map(r => r.exercise_date)
        );
        const thisMonthDays = thisMonthDates.size;

        // 今週のトレーニング日数
        const thisWeekDates = new Set(
            data
                .filter(r => {
                    const date = new Date(r.exercise_date || '');
                    return date >= thisWeekStart;
                })
                .map(r => r.exercise_date)
        );
        const thisWeekDays = thisWeekDates.size;

        // 総トレーニング回数
        const totalExercises = data.length;

        setStats({
            totalWorkoutDays,
            totalSets: totalExercises,
            thisMonthDays,
            thisWeekDays,
        });
    };

    // 過去7日間の日付を生成
    const getLast7Days = () => {
        const days = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            days.push(date.toISOString().split('T')[0]);
        }
        return days;
    };

    // 週間トレーニング頻度データ
    const weeklyData = () => {
        const last7Days = getLast7Days();
        const counts = last7Days.map(date => {
            return records.filter(r => r.exercise_date === date).length;
        });

        return {
            labels: last7Days.map(date => {
                const d = new Date(date);
                return `${d.getMonth() + 1}/${d.getDate()}`;
            }),
            datasets: [
                {
                    label: 'トレーニング回数',
                    data: counts,
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1,
                },
            ],
        };
    };

    // 部位別トレーニング回数データ
    const categoryData = () => {
        const categoryMap = new Map<string, number>();
        
        records.forEach(record => {
            const categoryName = record.exercise?.category?.name || '不明';
            categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + 1);
        });

        const labels = Array.from(categoryMap.keys());
        const data = Array.from(categoryMap.values());

        return {
            labels,
            datasets: [
                {
                    label: '回数',
                    data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        };
    };

    // 最近のトレーニング記録（直近5件）
    const recentRecords = records.slice(0, 5);

    return (
        <MainLayout>
            <Content>
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-neutral-200">
                        ダッシュボード
                    </h1>

                    {isLoading ? (
                        <div className="text-center py-20 text-gray-500 dark:text-neutral-400">
                            読み込み中...
                        </div>
                    ) : (
                        <>
                            {/* サマリーカード */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                <div className="bg-white dark:bg-neutral-800 shadow-md rounded-lg p-6">
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-neutral-400">
                                        総トレーニング日数
                                    </h3>
                                    <p className="text-3xl font-bold text-gray-800 dark:text-neutral-200 mt-2">
                                        {stats.totalWorkoutDays}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">日</p>
                                </div>

                                <div className="bg-white dark:bg-neutral-800 shadow-md rounded-lg p-6">
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-neutral-400">
                                        今月のトレーニング日数
                                    </h3>
                                    <p className="text-3xl font-bold text-gray-800 dark:text-neutral-200 mt-2">
                                        {stats.thisMonthDays}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">日</p>
                                </div>

                                <div className="bg-white dark:bg-neutral-800 shadow-md rounded-lg p-6">
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-neutral-400">
                                        今週のトレーニング日数
                                    </h3>
                                    <p className="text-3xl font-bold text-gray-800 dark:text-neutral-200 mt-2">
                                        {stats.thisWeekDays}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">日</p>
                                </div>

                                <div className="bg-white dark:bg-neutral-800 shadow-md rounded-lg p-6">
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-neutral-400">
                                        総トレーニング回数
                                    </h3>
                                    <p className="text-3xl font-bold text-gray-800 dark:text-neutral-200 mt-2">
                                        {stats.totalSets}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">回</p>
                                </div>
                            </div>

                            {/* グラフセクション */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                {/* 週間トレーニング頻度 */}
                                <div className="bg-white dark:bg-neutral-800 shadow-md rounded-lg p-6">
                                    <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-neutral-200">
                                        週間トレーニング頻度
                                    </h2>
                                    <Bar
                                        data={weeklyData()}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: {
                                                    display: false,
                                                },
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    ticks: {
                                                        stepSize: 1,
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                </div>

                                {/* 部位別トレーニング回数 */}
                                <div className="bg-white dark:bg-neutral-800 shadow-md rounded-lg p-6">
                                    <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-neutral-200">
                                        部位別トレーニング回数
                                    </h2>
                                    <div className="flex justify-center">
                                        <div className="w-64 h-64">
                                            <Doughnut
                                                data={categoryData()}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: true,
                                                    plugins: {
                                                        legend: {
                                                            position: 'bottom',
                                                        },
                                                    },
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 最近のトレーニング記録 */}
                            <div className="bg-white dark:bg-neutral-800 shadow-md rounded-lg p-6">
                                <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-neutral-200">
                                    最近のトレーニング記録
                                </h2>
                                {recentRecords.length === 0 ? (
                                    <p className="text-center text-gray-500 dark:text-neutral-400 py-8">
                                        トレーニング記録がありません
                                    </p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                                            <thead className="bg-gray-50 dark:bg-neutral-700">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">
                                                        日付
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">
                                                        種目
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">
                                                        部位
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">
                                                        重量
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">
                                                        回数
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
                                                {recentRecords.map((record) => (
                                                    <tr key={record.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                                            {record.exercise_date}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                                            {record.exercise?.name || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                                            {record.exercise?.category?.name || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                                            {record.weight} kg
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                                            {record.rep}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </Content>
        </MainLayout>
    );
};