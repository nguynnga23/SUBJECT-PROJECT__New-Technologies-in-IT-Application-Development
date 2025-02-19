import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userActive: null,
        token: null,
    },
    reducers: {
        setUser: (state, action) => {
            const { userActive, token } = action.payload || {};

            state.userActive = userActive;
            state.token = token;
        },

        logout: (state) => {
            state.userActive = null;
            state.token = null;
        },
    },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
