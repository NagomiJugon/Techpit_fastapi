import React, { useEffect, useReducer, useState } from 'react';
import type { components } from '@src/api/generated';
import { categoryReducer, initialState as CategoryReducerIS } from '@src/reducers/categoryReducer';
import { exerciseReducer, initialState as ExerciseReducerIS } from '@src/reducers/exerciseReducer';
import { ActionTypes, API_URL } from '@src/utils/constants';
import axios from 'axios';

type ExerciseRecord = components['schemas']['ExerciseRecordResponse'];
type Category = components['schemas']['Category'];
type Exercise = components['schemas']['ExerciseResponse'];

// TODO: generateInitialState から初期値を取得するように更新
const ExerciseRecordIS: ExerciseRecord = {
    id: 1,
    weight: 30,
    rep: 10,
    exercise_id: 1,
    exercise: {
        id: 0,
        name: "",
        category_id: 0,
        category: {
            id: 0,
            name: "",
        },
    },
    exercise_date: "2025-01-25",
};

interface FunctionProps {
    onDataSubmit: (inputData: ExerciseRecord) => void;
    onDataDelete?: () => void;
    recordId?: number;
}


export const ExerciseRecordForm = ({ onDataSubmit, onDataDelete, recordId }: FunctionProps) => {
    const [inputData, setInputData] = useState<ExerciseRecord>(ExerciseRecordIS);
    const [categoryState, setCategoryState] = useState<Category>();
    const [exerciseState, setExerciseState] = useState<Exercise>();
    const [categoriesState, categoryDispatch] = useReducer(categoryReducer, CategoryReducerIS);
    const [exercisesState, exerciseDispatch] = useReducer(exerciseReducer, ExerciseReducerIS);

    const fetchCategories = async () => {
        categoryDispatch({ type: ActionTypes.fetch });
        await axios.get<Category[]>(`${API_URL}/categories/assigned`)
            .then((response) => {
                categoryDispatch({ type: ActionTypes.success, payload: response.data });
                setCategoryState((prevData: any) => ({
                    ...prevData,
                    id: 0
                }))
            })
            .catch(() => {
                categoryDispatch({ type: ActionTypes.error });
            });
        await console.log(categoriesState);
    };

    const fetchExercises = async (categoryId?: number) => {
        exerciseDispatch({ type: ActionTypes.fetch });
        let endpoint = 'exercises';
        if (categoryId && categoryId !== 0) {
            endpoint = `exercises/category/${categoryId}`;
        }
        await axios.get<Exercise[]>(`${API_URL}/${endpoint}`)
            .then((response) => {
                exerciseDispatch({ type: ActionTypes.success, payload: response.data });
                console.log(exercisesState.exercises[0]);
                if (response.data.length > 0) {
                    const firstExercise = response.data[0];
                    const categoryForExercise = categoriesState.categories.find(c => c.id === firstExercise.category_id);
                    setInputData((prevData: any) => ({
                        ...prevData,
                        exercise_id: firstExercise.id,
                        exercise: {
                            id: firstExercise.id,
                            name: firstExercise.name,
                            category_id: firstExercise.category_id,
                            category: categoryForExercise || {
                                id: 0,
                                name: ''
                            }
                        }
                    }));
                }
            })
            .catch(() => {
                exerciseDispatch({ type: ActionTypes.error });
            });
    };

    // recordId が渡された場合、登録データを取得して表示
    useEffect(() => {
        const fetchRecordData = async () => {
            if (recordId) {
                try {
                    const response = await axios.get(`${API_URL}/exercise_records/${recordId}`);
                    const recordData: ExerciseRecord = response.data;
                    setInputData({
                        id: recordData.id,
                        weight: recordData.weight,
                        rep: recordData.rep,
                        exercise_id: recordData.exercise_id,
                        exercise: recordData.exercise,
                        exercise_date: recordData.exercise_date
                    });
                    setCategoryState({
                        id: recordData.exercise?.category?.id || 0,
                        name: recordData.exercise?.category?.name || ''
                    });
                } catch (error) {
                    console.error('Failed to fetch record data:', error);
                }
            }
        };
        
        fetchRecordData();
    }, [recordId]);

    useEffect(() => {
        fetchCategories();
        fetchExercises(0);
    }, []);

    useEffect(() => {
        if (categoryState?.id !== undefined && categoryState?.id !== 0) {
            fetchExercises(categoryState.id);
        }
    }, [categoryState?.id]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setInputData((prevData: any) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const dataset = event.target.selectedOptions[0].dataset;
        const categoryId = dataset.categoryId;
        const categoryName = dataset.categoryName;

        setCategoryState((prevData: any) => ({
            ...prevData,
            id: categoryId,
            name: categoryName
        }));
        setCategoryState((prevData: any) => ({
            ...prevData,
            id: categoryId
        }));
    }

    const handleExerciseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const dataset = event.target.selectedOptions[0].dataset;
        const exerciseId = dataset.exerciseId;
        const exerciseName = dataset.exerciseName;
        const categoryId = dataset.categoryId;
        
        const selectedCategory = categoriesState.categories.find(c => c.id === parseInt(categoryId || '0'));
        
        setInputData((prevData: any) => ({
            ...prevData,
            exercise_id: exerciseId,
            exercise: {
                id: exerciseId,
                name: exerciseName,
                category_id: categoryId,
                category: selectedCategory || {
                    id: 0,
                    name: ''
                }
            }
        }));
    }

    const handleSubmit = () => {
        onDataSubmit(inputData);
    };

    const handleDelete = () => {
        if (confirm('このレコードを削除してもよろしいですか?')) {
            if (onDataDelete) {
                onDataDelete();
            }
        }
    };

    return (
        <form className="bg-white dark:bg-neutral-800 shadow-md rounded px-6 sm:px-8 pt-6 pb-8 w-full">
            <div className="mb-4 w-full">
                <label className="block text-gray-700 dark:text-neutral-200 text-sm font-bold mb-2">
                    Target
                </label>
                <select className="block appearance-none w-full bg-white dark:bg-neutral-700 border border-gray-400 dark:border-neutral-600 hover:border-gray-500 dark:hover:border-neutral-500 ps-2 pe-8 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-gray-800 dark:text-neutral-200" id='category_id'
                    name="category_id"
                    onChange={handleCategoryChange}>
                    <option key={'category_0'} value={0} data-category-id={0} data-category-name>All Categories</option>
                    {categoriesState.categories.map(category => (
                        <option key={`category_${category.id}`} value={category.id}
                            data-category-id={category.id}
                            data-category-name={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4 w-full">
                <label className="block text-gray-700 dark:text-neutral-200 text-sm font-bold mb-2">
                    Exercise
                </label>
                <select className="block appearance-none w-full bg-white dark:bg-neutral-700 border border-gray-400 dark:border-neutral-600 hover:border-gray-500 dark:hover:border-neutral-500 ps-2 pe-8 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-gray-800 dark:text-neutral-200" id='exercise_id'
                    name="id" onChange={handleExerciseChange}>
                    {exercisesState.exercises.map(exercise => (
                        <option key={`exercise_${exercise.id}`} 
                            data-exercise-id={exercise.id}
                            data-exercise-name={exercise.name}
                            data-category-id={exercise.category_id}>
                            {exercise.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
                <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 dark:text-neutral-200 text-sm font-bold mb-2">
                        Weight (kg)
                    </label>
                    <input className="w-full shadow appearance-none border rounded py-2 px-3 border-gray-400 dark:border-neutral-600 text-gray-700 dark:text-neutral-200 bg-white dark:bg-neutral-700 leading-tight focus:outline-none focus:shadow-outline" id="weight" type="text"
                        name="weight" value={inputData?.weight} onChange={handleChange} />
                </div>
                <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 dark:text-neutral-200 text-sm font-bold mb-2">
                        Reps
                    </label>
                    <select className='block appearance-none w-full bg-white dark:bg-neutral-700 border border-gray-400 dark:border-neutral-600 hover:border-gray-500 dark:hover:border-neutral-500 ps-2 pe-8 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-gray-800 dark:text-neutral-200'
                        name='rep' value={inputData?.rep} onChange={handleChange}>
                        {Array.from({ length: 20 }, (_, i) => (
                            <option key={`rep_${i + 1}`} value={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex justify-center">
                <button className="bg-sky-500 opacity-75 hover:opacity-100 text-white font-bold py-2 px-4 mx-2 rounded focus:outline-none focus:shadow-outline" type="button"
                    onClick={handleSubmit}>
                    Done
                </button>
                {onDataDelete &&
                    <button className="bg-orange-500 opacity-75 hover:opacity-100 transition text-white font-bold py-2 px-4 mx-2 rounded focus:outline-none focus:shadow-outline" type="button"
                        onClick={handleDelete}>
                        Delete
                    </button>
                }
            </div>
        </form>
    );
};
