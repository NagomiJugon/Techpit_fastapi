import React, { useEffect, useReducer } from 'react';
import { MainLayout } from '@src/layouts/MainLayout/MainLayout';
import { Content } from '@src/components/Content/Content';
import { Table } from '@src/components/Content/Table/Table';
// import axios from 'axios';
import { ActionTypes, API_URL } from '@src/utils/constants';
import { Body } from '@src/components/Content/Table/Body';
import { exerciseRecordReducer, initialState } from '@src/reducers/ExerciseRecordReducer';
import { ExerciseRecord } from '@src/types/exerciseRecord';
import { Tr } from '@src/components/Content/Table/Tr';

export const Dashboard = () => {
    const [state, dispatch] = useReducer(exerciseRecordReducer, initialState);

    useEffect(() => {
        const fetchExercises = () => {
            // dispatch({ type: ActionTypes.fetch });
            // axios.get<ExerciseRecord[]>(`${API_URL}/exercise_records`)
            //     .then((response) => {
            //         dispatch({ type: ActionTypes.success, payload: response?.data });
            //     })
            //     .catch(() => {
            //         dispatch({ type: ActionTypes.error });
            //     });
            // console.log(state);
        };

        fetchExercises();
    }, []);

    return (
        <MainLayout>
            <Content>
                <Table>
                    <Body>
                        {state.exerciseRecords.map((exerciseRecord) => (
                            <Tr key={exerciseRecord.id} record={exerciseRecord} />
                        ))}
                    </Body>
                </Table>
            </Content>
        </MainLayout>
    );
};