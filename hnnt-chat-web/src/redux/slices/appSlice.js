import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
    name: 'app',
    initialState: {
        isConnected: true, // Trạng thái kết nối WebSocker
        loading: false,
    },
    reducers: {
        setConnectionStatus: (state, action) => {
            state.isConnected = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { setConnectionStatus, setLoading } = appSlice.actions;
export default appSlice.reducer;
