import { Category } from "@src/types/category"

interface ExerciseBase {
    name: string | '',
    category?: Category
}

export interface Exercise extends ExerciseBase {
    id: number | 0,
    type?: 'exercise'
}