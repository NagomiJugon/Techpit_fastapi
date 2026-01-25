import React, { useEffect, useState } from 'react';
import { MainLayout } from '@src/layouts/MainLayout/MainLayout';
import { Content } from '@src/components/Content/Content';
import { Table } from '@src/components/Content/Table/Table';
import { ExerciseRecordForm } from '@src/components/Content/ExerciseRecordForm';
import { Header } from '@src/components/Content/Table/Header';
import { Body } from '@src/components/Content/Table/Body';
import type { components } from '@src/api/generated';
import axios from 'axios';
import { API_URL } from '@src/utils/constants';
import { Tr } from '@src/components/Content/Table/Tr';

type ExerciseRecord = components['schemas']['ExerciseRecordResponse'];

export const Workout = () => {
    const [records, setRecords] = useState<ExerciseRecord[]>([]);

    const fetchRecords = async () => {
        try {
            const response = await axios.get<ExerciseRecord[]>(`${API_URL}/exercise_records`);
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
                                    <Tr key={r.id} record={r} onRefresh={fetchRecords} />
                                ))}
                            </Body>
                        </Table>
                    </div>
                </div>
            </Content>
        </MainLayout>
    );
};