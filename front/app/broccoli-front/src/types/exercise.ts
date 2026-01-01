import { Category } from "@src/types/category"

interface ExerciseBase {
    name: string | '',
    category_id?: number,
    category?: Category
}

export interface Exercise extends ExerciseBase {
    id: number | 0,
    type?: 'exercise'
}