import React, { useState } from 'react';
import { MainLayout } from '@src/layouts/MainLayout/MainLayout';
import { Content } from '@src/components/Content/Content';
import { Table } from '@src/components/Content/Table/Table';
import { ExerciseRecordForm } from '@src/components/Content/ExerciseRecordForm';
import { Header } from '@src/components/Content/Table/Header';
import { Body } from '@src/components/Content/Table/Body';
import { ExerciseRecord } from '@src/types/exerciseRecord';
import axios from 'axios';
import { API_URL } from '@src/utils/constants';
import { Tr } from '@src/components/Content/Table/Tr';

export const Workout = () => {
    const [components, setComponents] = useState<JSX.Element[]>([]);

    const handleDataSubmit = async (recordData: ExerciseRecord) => {
        await axios.post(`${API_URL}/exercise_records`, recordData)
            .then((response) => {
                setComponents((prevComponents) => [
                    ...prevComponents,
                    <Tr key={response.data.id} record={response.data} />,
                ]);
                console.log(response.data);
            })
            .catch((error) => {
                alert(error.message);
            });
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
                                {components}
                            </Body>
                        </Table>
                    </div>
                </div>
            </Content>
        </MainLayout>
    );
};