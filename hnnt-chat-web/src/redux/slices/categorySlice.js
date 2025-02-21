import { createSlice } from '@reduxjs/toolkit';
import categories from '../../sample_data/listCategory';
import { v4 as uuidv4 } from 'uuid';

const categorySlice = createSlice({
    name: 'category',
    initialState: {
        categories: categories,
        currentCategory: [],
    },
    reducers: {
        addCategory: (state, action) => {
            const { name, color } = action.payload;
            const categories = state.categories;
            const categoryOfList = categories.find((c) => c.name === name);

            const newCategory = {
                id: uuidv4(),
                name: name,
                color: color !== '' ? color : 'text-gray-500',
            };
            if (!categoryOfList) {
                categories.push(newCategory);
            }
            console.log(newCategory);
        },
        deleteCategory: (state, action) => {
            const { id } = action.payload;
            if (id) {
                state.categories = state.categories.filter((c) => c.id !== id);
            }
        },
        setCategory: (state, action) => {
            state.currentCategory = action.payload;
        },
    },
});

export const { addCategory, deleteCategory, setCategory } = categorySlice.actions;
export default categorySlice.reducer;
