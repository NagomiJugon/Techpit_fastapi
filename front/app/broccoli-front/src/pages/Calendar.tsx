import React, { useState, useEffect } from 'react';
import { MainLayout } from '@src/layouts/MainLayout/MainLayout';
import { Content } from '@src/components/Content/Content';
import axios from 'axios';
import { API_URL } from '@src/utils/constants';
import type { components } from '@src/api/generated';

type ViewType = 'week' | 'month' | 'year';
type ExerciseRecord = components['schemas']['ExerciseRecordResponse'];

interface DayRecords {
    date: string;
    records: ExerciseRecord[];
}

export const Calendar = () => {
    const [currentView, setCurrentView] = useState<ViewType>('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [weekRecords, setWeekRecords] = useState<DayRecords[]>([]);
    const [monthRecords, setMonthRecords] = useState<DayRecords[]>([]);
    const [yearRecords, setYearRecords] = useState<DayRecords[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDay, setSelectedDay] = useState<DayRecords | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (currentView === 'week') {
            fetchWeekRecords();
        } else if (currentView === 'month') {
            fetchMonthRecords();
        } else if (currentView === 'year') {
            fetchYearRecords();
        }
    }, [currentDate, currentView]);

    const getWeekDates = () => {
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        
        const dates: Date[] = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const fetchWeekRecords = async () => {
        setIsLoading(true);
        try {
            // 全レコードを取得してクライアント側でフィルタリング
            const response = await axios.get<ExerciseRecord[]>(`${API_URL}/exercise_records`);
            const allRecords = response.data;
            
            const weekDates = getWeekDates();
            const groupedRecords: DayRecords[] = weekDates.map(date => {
                const dateStr = date.toISOString().split('T')[0];
                return {
                    date: dateStr,
                    records: allRecords.filter(record => record.exercise_date === dateStr)
                };
            });
            
            setWeekRecords(groupedRecords);
        } catch (error) {
            console.error('Failed to fetch week records:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getMonthDates = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // 月の最初の日
        const firstDay = new Date(year, month, 1);
        // 月の最後の日
        const lastDay = new Date(year, month + 1, 0);
        
        // カレンダーの最初の日（週の開始に合わせる）
        const calendarStart = new Date(firstDay);
        calendarStart.setDate(firstDay.getDate() - firstDay.getDay());
        
        // カレンダーの最後の日（週の終わりに合わせる）
        const calendarEnd = new Date(lastDay);
        calendarEnd.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
        
        const dates: Date[] = [];
        const current = new Date(calendarStart);
        
        while (current <= calendarEnd) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        
        return dates;
    };

    const fetchMonthRecords = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get<ExerciseRecord[]>(`${API_URL}/exercise_records`);
            const allRecords = response.data;
            
            const monthDates = getMonthDates();
            const groupedRecords: DayRecords[] = monthDates.map(date => {
                const dateStr = date.toISOString().split('T')[0];
                return {
                    date: dateStr,
                    records: allRecords.filter(record => record.exercise_date === dateStr)
                };
            });
            
            setMonthRecords(groupedRecords);
        } catch (error) {
            console.error('Failed to fetch month records:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchYearRecords = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get<ExerciseRecord[]>(`${API_URL}/exercise_records`);
            const allRecords = response.data;
            
            const year = currentDate.getFullYear();
            const yearStart = new Date(year, 0, 1);
            const yearEnd = new Date(year, 11, 31);
            
            const dates: Date[] = [];
            const current = new Date(yearStart);
            
            while (current <= yearEnd) {
                dates.push(new Date(current));
                current.setDate(current.getDate() + 1);
            }
            
            const groupedRecords: DayRecords[] = dates.map(date => {
                const dateStr = date.toISOString().split('T')[0];
                return {
                    date: dateStr,
                    records: allRecords.filter(record => record.exercise_date === dateStr)
                };
            });
            
            setYearRecords(groupedRecords);
        } catch (error) {
            console.error('Failed to fetch year records:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDayClick = (day: DayRecords) => {
        setSelectedDay(day);
        setIsModalOpen(true);
    };

    const handleMonthClick = (month: number) => {
        const newDate = new Date(currentDate.getFullYear(), month, 1);
        setCurrentDate(newDate);
        setCurrentView('month');
    };

    const getIntensityColor = (recordCount: number) => {
        if (recordCount === 0) return 'bg-gray-100 dark:bg-neutral-700';
        if (recordCount <= 3) return 'bg-green-200 dark:bg-green-900';
        if (recordCount <= 6) return 'bg-green-400 dark:bg-green-700';
        if (recordCount <= 9) return 'bg-green-600 dark:bg-green-500';
        return 'bg-green-800 dark:bg-green-300';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDay(null);
    };

    const handlePrevious = () => {
        const newDate = new Date(currentDate);
        if (currentView === 'week') {
            newDate.setDate(newDate.getDate() - 7);
        } else if (currentView === 'month') {
            newDate.setMonth(newDate.getMonth() - 1);
        } else {
            newDate.setFullYear(newDate.getFullYear() - 1);
        }
        setCurrentDate(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(currentDate);
        if (currentView === 'week') {
            newDate.setDate(newDate.getDate() + 7);
        } else if (currentView === 'month') {
            newDate.setMonth(newDate.getMonth() + 1);
        } else {
            newDate.setFullYear(newDate.getFullYear() + 1);
        }
        setCurrentDate(newDate);
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const formatTitle = () => {
        if (currentView === 'week') {
            const weekStart = new Date(currentDate);
            weekStart.setDate(currentDate.getDate() - currentDate.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            return `${weekStart.getFullYear()}年${weekStart.getMonth() + 1}月${weekStart.getDate()}日 - ${weekEnd.getMonth() + 1}月${weekEnd.getDate()}日`;
        } else if (currentView === 'month') {
            return `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月`;
        } else {
            return `${currentDate.getFullYear()}年`;
        }
    };

    return (
        <MainLayout>
            <Content>
                <div className="max-w-7xl mx-auto">
                    {/* ヘッダー */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-200">
                            カレンダー
                        </h1>
                    </div>

                    {/* コントロールバー */}
                    <div className="bg-white dark:bg-neutral-800 shadow-md rounded-lg px-6 py-4 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            {/* 日付ナビゲーション */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleToday}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-neutral-200 bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 rounded-lg transition-colors">
                                    今日
                                </button>
                                <button
                                    onClick={handlePrevious}
                                    className="p-2 text-gray-700 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="p-2 text-gray-700 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200 ml-4">
                                    {formatTitle()}
                                </h2>
                            </div>

                            {/* ビュー切り替えタブ */}
                            <div className="flex bg-gray-100 dark:bg-neutral-700 rounded-lg p-1">
                                <button
                                    onClick={() => setCurrentView('week')}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                        currentView === 'week'
                                            ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-sm'
                                            : 'text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200'
                                    }`}>
                                    週
                                </button>
                                <button
                                    onClick={() => setCurrentView('month')}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                        currentView === 'month'
                                            ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-sm'
                                            : 'text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200'
                                    }`}>
                                    月
                                </button>
                                <button
                                    onClick={() => setCurrentView('year')}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                        currentView === 'year'
                                            ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-sm'
                                            : 'text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200'
                                    }`}>
                                    年
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* カレンダー表示エリア */}
                    <div className="bg-white dark:bg-neutral-800 shadow-md rounded-lg overflow-hidden">
                        {currentView === 'week' && (
                            <div className="p-4">
                                {isLoading ? (
                                    <div className="text-center py-20 text-gray-500 dark:text-neutral-400">
                                        読み込み中...
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-7 gap-2 md:auto-rows-fr">
                                        {weekRecords.map((day, index) => {
                                            const date = new Date(day.date);
                                            const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
                                            const isToday = day.date === new Date().toISOString().split('T')[0];
                                            
                                            return (
                                                <div
                                                    key={day.date}
                                                    className={`border rounded-lg overflow-hidden flex flex-col ${
                                                        isToday
                                                            ? 'border-blue-500 dark:border-blue-400'
                                                            : 'border-gray-200 dark:border-neutral-700'
                                                    }`}>
                                                    {/* 日付ヘッダー */}
                                                    <div
                                                        className={`px-3 py-2 text-center font-semibold ${
                                                            isToday
                                                                ? 'bg-blue-500 text-white'
                                                                : index === 0
                                                                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                                                : index === 6
                                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                                : 'bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-neutral-200'
                                                        }`}>
                                                        <div className="text-xs">{dayNames[index]}</div>
                                                        <div className="text-lg">{date.getDate()}</div>
                                                    </div>
                                                    
                                                    {/* トレーニング記録 */}
                                                    <div className="p-2 flex-1 bg-gray-50 dark:bg-neutral-900/50">
                                                        {day.records.length === 0 ? (
                                                            <div className="text-xs text-gray-400 dark:text-neutral-500 text-center mt-4">
                                                                記録なし
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                {day.records.map((record) => (
                                                                    <div
                                                                        key={record.id}
                                                                        className="bg-white dark:bg-neutral-800 rounded p-2 shadow-sm border border-gray-200 dark:border-neutral-700">
                                                                        <div className="text-xs font-semibold text-gray-800 dark:text-neutral-200 truncate">
                                                                            {record.exercise?.name || '-'}
                                                                        </div>
                                                                        <div className="text-xs text-gray-600 dark:text-neutral-400 mt-1">
                                                                            {record.weight}kg × {record.rep}回
                                                                        </div>
                                                                        <div className="text-xs text-gray-500 dark:text-neutral-500 mt-1">
                                                                            {record.exercise?.category?.name || '-'}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                        {currentView === 'month' && (
                            <div className="p-4">
                                {isLoading ? (
                                    <div className="text-center py-20 text-gray-500 dark:text-neutral-400">
                                        読み込み中...
                                    </div>
                                ) : (
                                    <div>
                                        {/* 曜日ヘッダー */}
                                        <div className="grid grid-cols-7 gap-1 mb-2">
                                            {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
                                                <div
                                                    key={day}
                                                    className={`text-center py-2 text-sm font-semibold ${
                                                        index === 0
                                                            ? 'text-red-600 dark:text-red-400'
                                                            : index === 6
                                                            ? 'text-blue-600 dark:text-blue-400'
                                                            : 'text-gray-700 dark:text-neutral-300'
                                                    }`}>
                                                    {day}
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* カレンダーグリッド */}
                                        <div className="grid grid-cols-7 gap-1">
                                            {monthRecords.map((day, index) => {
                                                const date = new Date(day.date);
                                                const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                                                const isToday = day.date === new Date().toISOString().split('T')[0];
                                                const dayOfWeek = date.getDay();
                                                
                                                return (
                                                    <div
                                                        key={day.date}
                                                        onClick={() => handleDayClick(day)}
                                                        className={`min-h-[100px] border rounded-lg p-2 cursor-pointer transition-all hover:shadow-md ${
                                                            isToday
                                                                ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                                                : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
                                                        } ${
                                                            !isCurrentMonth ? 'opacity-40' : ''
                                                        }`}>
                                                        {/* 日付 */}
                                                        <div
                                                            className={`text-sm font-semibold mb-1 ${
                                                                isToday
                                                                    ? 'text-blue-600 dark:text-blue-400'
                                                                    : dayOfWeek === 0
                                                                    ? 'text-red-600 dark:text-red-400'
                                                                    : dayOfWeek === 6
                                                                    ? 'text-blue-600 dark:text-blue-400'
                                                                    : 'text-gray-700 dark:text-neutral-300'
                                                            }`}>
                                                            {date.getDate()}
                                                        </div>
                                                        
                                                        {/* トレーニング名リスト */}
                                                        <div className="space-y-1">
                                                            {day.records.slice(0, 3).map((record) => (
                                                                <div
                                                                    key={record.id}
                                                                    className="text-xs bg-white dark:bg-neutral-800 rounded px-2 py-1 truncate border border-gray-200 dark:border-neutral-700">
                                                                    <span className="text-gray-800 dark:text-neutral-200 font-medium">
                                                                        {record.exercise?.name || '-'}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                            {day.records.length > 3 && (
                                                                <div className="text-xs text-gray-500 dark:text-neutral-400 text-center">
                                                                    +{day.records.length - 3}件
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {currentView === 'year' && (
                            <div className="p-4">
                                {isLoading ? (
                                    <div className="text-center py-20 text-gray-500 dark:text-neutral-400">
                                        読み込み中...
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {Array.from({ length: 12 }, (_, monthIndex) => {
                                            const monthRecords = yearRecords.filter(day => {
                                                const date = new Date(day.date);
                                                return date.getMonth() === monthIndex;
                                            });
                                            
                                            // 月の最初の日と最後の日を取得
                                            const firstDay = new Date(currentDate.getFullYear(), monthIndex, 1);
                                            const lastDay = new Date(currentDate.getFullYear(), monthIndex + 1, 0);
                                            
                                            // カレンダーグリッド用に週の開始に合わせる
                                            const startPadding = firstDay.getDay();
                                            const daysInMonth = lastDay.getDate();
                                            
                                            return (
                                                <div
                                                    key={monthIndex}
                                                    className="bg-white dark:bg-neutral-900 rounded-lg p-4 border border-gray-200 dark:border-neutral-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer"
                                                    onClick={() => handleMonthClick(monthIndex)}>
                                                    {/* 月名 */}
                                                    <h3 className="text-sm font-semibold text-gray-800 dark:text-neutral-200 mb-3">
                                                        {monthIndex + 1}月
                                                    </h3>
                                                    
                                                    {/* 曜日ヘッダー */}
                                                    <div className="grid grid-cols-7 gap-1 mb-1">
                                                        {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
                                                            <div
                                                                key={day}
                                                                className="text-[10px] text-center text-gray-500 dark:text-neutral-400">
                                                                {day}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    
                                                    {/* カレンダーグリッド */}
                                                    <div className="grid grid-cols-7 gap-1">
                                                        {/* 空白セル */}
                                                        {Array.from({ length: startPadding }).map((_, i) => (
                                                            <div key={`empty-${i}`} className="aspect-square" />
                                                        ))}
                                                        
                                                        {/* 日付セル */}
                                                        {Array.from({ length: daysInMonth }, (_, dayIndex) => {
                                                            const date = new Date(currentDate.getFullYear(), monthIndex, dayIndex + 1);
                                                            const dateStr = date.toISOString().split('T')[0];
                                                            const dayData = monthRecords.find(d => d.date === dateStr);
                                                            const recordCount = dayData?.records.length || 0;
                                                            const isToday = dateStr === new Date().toISOString().split('T')[0];
                                                            
                                                            return (
                                                                <div
                                                                    key={dayIndex}
                                                                    className={`aspect-square rounded-sm ${
                                                                        getIntensityColor(recordCount)
                                                                    } ${
                                                                        isToday ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
                                                                    }`}
                                                                    title={`${dayIndex + 1}日: ${recordCount}件のトレーニング`}
                                                                />
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                
                                {/* 凡例 */}
                                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-600 dark:text-neutral-400">
                                    <span>少ない</span>
                                    <div className="flex gap-1">
                                        <div className="w-4 h-4 rounded-sm bg-gray-100 dark:bg-neutral-700" />
                                        <div className="w-4 h-4 rounded-sm bg-green-200 dark:bg-green-900" />
                                        <div className="w-4 h-4 rounded-sm bg-green-400 dark:bg-green-700" />
                                        <div className="w-4 h-4 rounded-sm bg-green-600 dark:bg-green-500" />
                                        <div className="w-4 h-4 rounded-sm bg-green-800 dark:bg-green-300" />
                                    </div>
                                    <span>多い</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 詳細モーダル */}
                {isModalOpen && selectedDay && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                        onClick={closeModal}>
                        <div
                            className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}>
                            {/* モーダルヘッダー */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-700">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
                                    {new Date(selectedDay.date).toLocaleDateString('ja-JP', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        weekday: 'long'
                                    })}
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            {/* モーダルボディ */}
                            <div className="p-4 overflow-y-auto max-h-[calc(80vh-120px)]">
                                {selectedDay.records.length === 0 ? (
                                    <div className="text-center py-10 text-gray-500 dark:text-neutral-400">
                                        この日はトレーニング記録がありません
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {selectedDay.records.map((record) => (
                                            <div
                                                key={record.id}
                                                className="bg-gray-50 dark:bg-neutral-900 rounded-lg p-4 border border-gray-200 dark:border-neutral-700">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                                                {record.exercise?.name || '-'}
                                                            </span>
                                                            <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
                                                                {record.exercise?.category?.name || '-'}
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                            <div>
                                                                <span className="text-gray-600 dark:text-neutral-400">重量:</span>
                                                                <span className="ml-2 font-medium text-gray-800 dark:text-neutral-200">
                                                                    {record.weight} kg
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-600 dark:text-neutral-400">回数:</span>
                                                                <span className="ml-2 font-medium text-gray-800 dark:text-neutral-200">
                                                                    {record.rep} 回
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Content>
        </MainLayout>
    );
};
