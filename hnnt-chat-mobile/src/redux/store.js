import { configureStore } from '@reduxjs/toolkit';
import friendReducer from './slices/friendSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
    reducer: {
        friends: friendReducer,
        auth: authReducer,
    },
});
