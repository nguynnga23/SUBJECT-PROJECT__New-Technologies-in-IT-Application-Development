import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import categoryReducer from './slices/categorySlice';
import appReducer from './slices/appSlice';
import modalReducer from './slices/modalSlice';
import storage from 'redux-persist/lib/storage'; // Lưu vào localStorage
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';

const persistConfig = {
    key: 'root', // key 'root' để đảm bảo redux-persist lưu toàn bộ store
    storage,
    whitelist: ['auth'], // Chỉ lưu reducer 'auth'
};

const rootReducer = combineReducers({
    auth: authReducer,
    chat: chatReducer,
    category: categoryReducer,
    app: appReducer,
    modal: modalReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Bỏ qua kiểm tra serializable
        }),
});

export const persistor = persistStore(store);
export default store;
