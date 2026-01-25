import type { components } from "@src/api/generated";
import { ActionTypes, RequestStates } from "@src/utils/constants";

type Exercise = components['schemas']['ExerciseResponse'];

type ExercisesState = {
    exercises: Exercise[],
    requestState: RequestStates
};

export const initialState = {
    exercises: [],
    requestState: RequestStates.idle,
};

type ExerciseAction = 
    | { type: ActionTypes.fetch }
    | { type: ActionTypes.success; payload: Exercise[] }
    | { type: ActionTypes.error }

export const exerciseReducer = (
    state: ExercisesState, action: ExerciseAction
): ExercisesState => {
    switch(action.type) {
        case ActionTypes.fetch: {
            return {
                ...state,
                requestState: RequestStates.loading
            }
        }
        case ActionTypes.success: {
            return {
                exercises: action.payload,
                requestState: RequestStates.success
            }
        }
        case ActionTypes.error: {
            return {
                ...state,
                requestState: RequestStates.error
            }
        }
        default: {
            throw new Error();
        }
    }
};