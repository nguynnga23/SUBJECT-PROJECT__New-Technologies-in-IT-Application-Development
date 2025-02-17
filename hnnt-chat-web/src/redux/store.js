import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import friendRecucer from './slices/friendSlice';
import categoryReducer from './slices/categorySlice';
import appReducer from './slices/appSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        category: categoryReducer,
        friend: friendRecucer,
        app: appReducer,
    },
});

export default store;
