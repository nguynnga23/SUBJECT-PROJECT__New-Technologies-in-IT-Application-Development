import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: [], //Danh sách các cuộc trò chuyện
        activeChat: null, // ID cuộc trò chuyện đang mở
    },
    reducers: {
        setChats: (state, action) => {
            state.chats = action.payload;
        },
        setActiveChat: (state, action) => {
            state.activeChat = action.payload;
        },
    },
});

export const { setChats, setActiveChat } = chatSlice.actions;
export default chatSlice.reducer;
