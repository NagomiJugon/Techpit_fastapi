import { Category } from '@src/types/category';
import { RequestStates, ActionTypes } from '@src/utils/constants';

type CategoriesState = {
    categories: Category[],
    requestState: RequestStates
};

export const initialState = {
    categories: [],
    requestState: RequestStates.idle,
};

type CategoryAction = 
    | { type: ActionTypes.fetch }
    | { type: ActionTypes.success; payload: Category[] }
    | { type: ActionTypes.error }

export const categoryReducer = (
    state: CategoriesState, action: CategoryAction
): CategoriesState => {
    switch(action.type) {
        case ActionTypes.fetch: {
            return {
                ...state,
                requestState: RequestStates.loading
            }
        }
        case ActionTypes.success: {
            return {
                categories: action.payload,
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