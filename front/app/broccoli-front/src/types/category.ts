interface CategoryBase {
    name: string | ''
}

export interface Category extends CategoryBase {
    id: number | 0,
    type?: 'category'
}

export const initialState = {
    id: 1,
    name: '',
    type: undefined
};