import React, { useEffect, useState } from 'react';
import type { components } from '@src/api/generated';
import { Modal } from '@src/components/Content/Modal';
import { ExerciseRecordForm } from '../ExerciseRecordForm';
import axios from 'axios';
import { API_URL } from '@src/utils/constants';

type ExerciseRecord = components['schemas']['ExerciseRecordResponse'];

type RecordProps<T> = {
    record: T;
    onRefresh?: () => void;
};

const isExerciseRecord = (props: any): props is ExerciseRecord => {
    return props && typeof props === 'object' && 'exercise_id' in props && 'weight' in props && 'rep' in props;
}

export const ExerciseRecordRow = <T extends ExerciseRecord>({ record, onRefresh }: RecordProps<T>) => {
    const [open, setOpen] = useState(false);
    const [exerciseRecordId, setExerciseRecordId] = useState<number>();

    const handleDataSubmit = async (recordData: ExerciseRecord) => {
        try {
            const payload = {
                exercise_id: recordData.exercise?.id,
                weight: recordData.weight,
                rep: recordData.rep
            };

            if (recordData.id) {
                // Update existing record
                await axios.put(`${API_URL}/exercise_records/${recordData.id}`, payload);
            } else {
                // Create new record
                await axios.post(`${API_URL}/exercise_records`, payload);
            }
            setOpen(false);
            // Refresh table data
            if (onRefresh) {
                onRefresh();
            }
        } catch (error) {
            console.error('Failed to submit record:', error);
            alert('データの保存に失敗しました');
        }
    };

    const handleDataDelete = async () => {
        try {
            if (record.id) {
                await axios.delete(`${API_URL}/exercise_records/${record.id}`);
                setOpen(false);
                // Refresh table data
                if (onRefresh) {
                    onRefresh();
                }
            }
        } catch (error) {
            console.error('Failed to delete record:', error);
            alert('データの削除に失敗しました');
        }
    };


    return (
        <tr>
            <td className="size-px whitespace-nowrap">
                <div className="ps-6 lg:ps-3 xl:pe-6 py-3">
                    <div className="flex items-center gap-x-3">
                        <div className="grow">
                            <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                {record.exercise?.name}
                            </span>
                        </div>
                    </div>
                </div>
            </td>
            <td className="h-px w-72 whitespace-nowrap">
                <div className="px-6 py-3">
                    <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                        {record.exercise?.category?.name}
                    </span>
                </div>
            </td>
            <td className="h-px w-72 whitespace-nowrap">
                <div className="px-6 py-3">
                    <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                        {record?.weight} kg
                    </span>
                </div>
            </td>
            <td className="h-px w-72 whitespace-nowrap">
                <div className="px-6 py-3">
                    <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                        {record?.rep}
                    </span>
                </div>
            </td>
            <td className="size-px whitespace-nowrap">
                <div className="px-6 py-3">
                    <span className="text-sm text-gray-500 dark:text-neutral-500">
                        {record.exercise_date?.toString()}
                    </span>
                </div>
            </td>
            <td className="size-px whitespace-nowrap">
                <div className="px-6 py-1.5">
                    <a className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                        onClick={() => setOpen(true)}
                        data-exercise-record-id={record.id}
                    >
                        Edit
                    </a>
                </div>
                <Modal 
                    isOpen={open} 
                    onClose={() => setOpen(false)} 
                    childComponent={
                        <ExerciseRecordForm 
                            onDataSubmit={handleDataSubmit} 
                            onDataDelete={handleDataDelete}
                            recordId={record.id}
                        />
                    }
                />
            </td>
        </tr>
    );
};