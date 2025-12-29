import React, { useEffect, useReducer, useState } from 'react';
import { ExerciseRecord, initialState as ExerciseRecordIS } from '@src/types/exerciseRecord';
import { Category } from '@src/types/category';
import { categoryReducer, initialState as CategoryReducerIS } from '@src/reducers/CategoryReducer';
import { exerciseReducer, initialState as ExerciseReducerIS } from '@src/reducers/ExerciseReducer';
import { ActionTypes, API_URL } from '@src/utils/constants';
import axios from 'axios';
import { Exercise } from '@src/types/exercise';

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
                    setInputData((prevData: any) => ({
                        ...prevData,
                        exercise: {
                            ...prevData.exercise,
                            id: response.data[0].id,
                            name: response.data[0].name,
                            category: {
                                ...prevData.exercise.category,
                                id: response.data[0]?.category?.id,
                                name: response.data[0]?.category?.name
                            }
                        }
                    }));
                }
                console.log(inputData);
            })
            .catch(() => {
                exerciseDispatch({ type: ActionTypes.error });
            });
        await console.log(exercisesState);
    };

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
        console.log(inputData);
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const dataset = event.target.selectedOptions[0].dataset;
        const categoryId = dataset.categoryId;
        const categoryName = dataset.categoryName;
        console.log(dataset);
        setCategoryState((prevData: any) => ({
            ...prevData,
            id: categoryId,
            name: categoryName
        }));
        setCategoryState((prevData: any) => ({
            ...prevData,
            id: categoryId
        }));
        console.log(inputData);
    }

    const handleExerciseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const dataset = event.target.selectedOptions[0].dataset;
        const exerciseId = dataset.exerciseId;
        const exerciseName = dataset.exerciseName;
        const categoryId = dataset.categoryId;
        const categoryName = dataset.categoryName;
        setInputData((prevData: any) => ({
            ...prevData,
            exercise: {
                ...prevData.exercise,
                id: exerciseId,
                name: exerciseName,
                category: {
                    ...prevData.exercise.category,
                    id: categoryId,
                    name: categoryName
                }
            }
        }));
        console.log(inputData);
    }

    const handleSubmit = () => {
        onDataSubmit(inputData);
    };

    return (
        <form className="bg-white dark:bg-neutral-800 shadow-md rounded px-8 pt-6 pb-8 w-full">
            <div className="inline-block mb-2 w-full">
                <label className="block text-gray-700 dark:text-neutral-200 text-sm font-bold my-1">
                    Target
                </label>
                <select className="block appearance-none w-full bg-white dark:bg-neutral-700 border border-gray-400 dark:border-neutral-600 hover:border-gray-500 dark:hover:border-neutral-500 ps-2 pe-8 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-gray-800 dark:text-neutral-200" id='category_id'
                    name="category_id"
                    onChange={handleCategoryChange}>
                    <option key={'category_0'} value={0} data-category-id={0} data-category-name>No Category</option>
                    {categoriesState.categories.map(category => (
                        <option key={`category_${category.id}`} value={category.id}
                            data-category-id={category.id}
                            data-category-name={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="inline-block mb-2 w-full">
                <label className="block text-gray-700 dark:text-neutral-200 text-sm font-bold my-1">
                    Exercise
                </label>
                <select className="block appearance-none w-full bg-white dark:bg-neutral-700 border border-gray-400 dark:border-neutral-600 hover:border-gray-500 dark:hover:border-neutral-500 ps-2 pe-8 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-gray-800 dark:text-neutral-200" id='exercise_id'
                    name="id" onChange={handleExerciseChange}>
                    {exercisesState.exercises.map(exercise => (
                        <option key={`exercise_${exercise.id}`} 
                            data-exercise-id={exercise.id}
                            data-exercise-name={exercise.name}
                            data-category-id={exercise?.category?.id}
                            data-category-name={exercise?.category?.name}>
                            {exercise.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex mb-4">
                <div className="mb-4 w-3/5 flex-initial me-5">
                    <label className="block text-gray-700 dark:text-neutral-200 text-sm font-bold my-1">
                        Weight (kg)
                    </label>
                    <input className="shadow appearance-none border rounded py-2 px-3 border-gray-400 dark:border-neutral-600 text-gray-700 dark:text-neutral-200 bg-white dark:bg-neutral-700 leading-tight focus:outline-none focus:shadow-outline" id="weight" type="text"
                        name="weight" value={inputData?.weight} onChange={handleChange} />
                </div>
                <div className="mb-4 w-2/5">
                    <label className="block text-gray-700 dark:text-neutral-200 text-sm font-bold my-1">
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
                        onClick={handleSubmit}>
                        Delete
                    </button>
                }
            </div>
        </form>
    );
};
