/**
 * このファイルは自動生成されます。
 * generated.ts の @example コメントから initialState を抽出します。
 */

import type { components } from "@/api/generated";

type Categories = components["schemas"]["Category"][];
type Exercises = components["schemas"]["ExerciseResponse"][];
type ExerciseRecords = components["schemas"]["ExerciseRecordResponse"][];

/**
 * Categoryの初期値を生成
 */
export const getInitialCategories = (): Categories => {
  return [
    {
      id: 0,
      name: "",
    },
  ];
};

/**
 * Exerciseの初期値を生成
 */
export const getInitialExercises = (): Exercises => {
  return [
    {
      id: 0,
      name: "",
      category_id: 0,
    },
  ];
};

/**
 * ExerciseRecordの初期値を生成
 */
export const getInitialExerciseRecords = (): ExerciseRecords => {
  return [
    {
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
    },
  ];
};

/**
 * カテゴリーのための初期 State 形状
 */
export interface CategoryState {
  list: Categories;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

/**
 * Exerciseのための初期 State 形状
 */
export interface ExerciseState {
  list: Exercises;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

/**
 * ExerciseRecordのための初期 State 形状
 */
export interface ExerciseRecordState {
  list: ExerciseRecords;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

/**
 * カテゴリー State の初期値を取得
 */
export const getInitialCategoryState = (): CategoryState => ({
  list: getInitialCategories(),
  status: "idle",
  error: null,
});

/**
 * Exercise State の初期値を取得
 */
export const getInitialExerciseState = (): ExerciseState => ({
  list: getInitialExercises(),
  status: "idle",
  error: null,
});

/**
 * ExerciseRecord State の初期値を取得
 */
export const getInitialExerciseRecordState = (): ExerciseRecordState => ({
  list: getInitialExerciseRecords(),
  status: "idle",
  error: null,
});
