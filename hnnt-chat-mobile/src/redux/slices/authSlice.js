import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: '<your-jwt-token>', // Thay bằng token thực tế từ login
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
    },
});

export const { setToken } = authSlice.actions;
export default authSlice.reducer;
