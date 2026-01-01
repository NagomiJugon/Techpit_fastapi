import { Exercise } from '@src/types/exercise';

// 初期値を指定するときにnullにしたいが...
export interface ExerciseRecord {
    id?: number,
    exercise_id?: number,  // APIリクエスト用
    exercise: Exercise,    // APIレスポンス用
    weight: number,
    rep: number,
    exercise_date: Date | string,
    type?: 'exercise_record'
}

export const initialState = {
    id: undefined,
    exercise_id: undefined,
    exercise: {
        id: 1,
        name: '',
        category_id: 0,
        category: {
            id: 0,
            name: '',
            type: undefined
        },
        type: undefined
    },
    weight: 0,
    rep: 1,
    exercise_date: '',
    type: undefined
}