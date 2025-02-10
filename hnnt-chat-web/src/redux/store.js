import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import messageReducer from './slices/messageSlice';
import appReducer from './slices/appSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        messages: messageReducer,
        app: appReducer,
    },
});

export default store;
