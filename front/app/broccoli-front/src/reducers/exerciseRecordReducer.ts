import type { components } from '@src/api/generated';
import { RequestStates, ActionTypes } from '@src/utils/constants';

type ExerciseRecord = components['schemas']['ExerciseRecordResponse'];

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