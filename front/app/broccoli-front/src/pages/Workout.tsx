import React, { useEffect, useState } from 'react';
import { MainLayout } from '@src/layouts/MainLayout/MainLayout';
import { Content } from '@src/components/Content/Content';
import { Table } from '@src/components/Content/ExerciseRecordTable/Table';
import { ExerciseRecordForm } from '@src/components/Content/ExerciseRecordForm';
import { Header } from '@src/components/Content/ExerciseRecordTable/Header';
import { Body } from '@src/components/Content/ExerciseRecordTable/Body';
import type { components } from '@src/api/generated';
import axios from 'axios';
import { API_URL } from '@src/utils/constants';
import { Row } from '@src/components/Content/ExerciseRecordTable/Row';

type ExerciseRecord = components['schemas']['ExerciseRecordResponse'];

export const Workout = () => {
    const [records, setRecords] = useState<ExerciseRecord[]>([]);

    const fetchRecords = async () => {
        try {
            // 本日の日付をYYYY-MM-DD形式で取得
            const today = new Date().toISOString().split('T')[0];
            const response = await axios.get<ExerciseRecord[]>(`${API_URL}/exercise_records`, {
                params: { date: today }
            });
            setRecords(response.data);
        } catch (error) {
            console.error('Failed to fetch records:', error);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const handleDataSubmit = async (recordData: ExerciseRecord) => {
        // バックエンドAPIが期待する形式に変換
        const apiData = {
            exercise_id: recordData.exercise.id,
            weight: recordData.weight,
            rep: recordData.rep,
        };

        try {
            const response = await axios.post(`${API_URL}/exercise_records`, apiData);
            const newRecord: ExerciseRecord = response.data;
            setRecords((prev) => [...prev, newRecord]);
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <MainLayout>
            <Content>
                <div className='flex flex-row items-start gap-4'>
                    <div className='w-1/3 w-96'>
                        <ExerciseRecordForm onDataSubmit={handleDataSubmit} />
                    </div>
                    <div className='w-2/3'>
                        <Table>
                            <Header />
                            <Body>
                                {records.map((r) => (
                                    <Row key={r.id} record={r} onRefresh={fetchRecords} />
                                ))}
                            </Body>
                        </Table>
                    </div>
                </div>
            </Content>
        </MainLayout>
    );
};