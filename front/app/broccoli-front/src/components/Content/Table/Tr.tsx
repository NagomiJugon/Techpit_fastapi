import React, { useEffect, useState } from 'react';
import { ExerciseRecord } from '@src/types/exerciseRecord';
import { Modal } from '@src/components/Content/Modal';
import { ExerciseRecordForm } from '../ExerciseRecordForm';
import axios from 'axios';
import { API_URL } from '@src/utils/constants';

type RecordProps<T> = {
    record: T;
};

const isExerciseRecord = (props: any): props is ExerciseRecord => {
    return (props as ExerciseRecord)?.type === 'exercise_record';
}

export const Tr = <T extends ExerciseRecord>({ record }: RecordProps<T>) => {
    const [open, setOpen] = useState(false);
    const [exerciseRecordId, setExerciseRecordId] = useState<number>();

    const handleDataSubmit = async (recordData: ExerciseRecord) => {
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
                            onDataDelete={() => {}}
                            recordId={record.id}
                        />
                    }
                />
            </td>
        </tr>
    );
};