import { ExerciseRecord } from '@src/types/exerciseRecord';
import { RequestStates, ActionTypes } from '@src/utils/constants';

type ExerciseRecordState = {
    exerciseRecords: ExerciseRecord[],
    requestState: RequestStates
};

export const initialState = {
    exerciseRecords: [],
    requestState: RequestStates.idle,
};

type ExerciseRecordAction = 
    | { type: ActionTypes.fetch }
    | { type: ActionTypes.success; payload: ExerciseRecord[] }
    | { type: ActionTypes.error }

export const exerciseRecordReducer = (
    state: ExerciseRecordState, action: ExerciseRecordAction
): ExerciseRecordState => {
    switch(action.type) {
        case ActionTypes.fetch: {
            return {
                ...state,
                requestState: RequestStates.loading
            }
        }
        case ActionTypes.success: {
            return {
                exerciseRecords: action.payload,
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