import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: [], //Danh sách các cuộc trò chuyện
        activeChat: null, // ID cuộc trò chuyện đang mở
        showRightBar: false,
        showRightBarSearch: false,
        activeTabMess: 'priority',
    },
    reducers: {
        setChats: (state, action) => {
            state.chats = action.payload;
        },
        setActiveChat: (state, action) => {
            state.activeChat = action.payload;
        },
        setShowOrOffRightBar: (state, action) => {
            state.showRightBar = action;
            state.showRightBarSearch = false;
        },
        setShowOrOffRightBarSearch: (state, action) => {
            state.showRightBarSearch = action;
            state.showRightBar = false;
        },
        setActiveTabMessToPriority: (state) => {
            state.activeTabMess = 'priority';
        },
        setActiveTabMessToOrther: (state) => {
            state.activeTabMess = 'other';
        },
    },
});

export const {
    setChats,
    setActiveChat,
    setShowOrOffRightBar,
    setShowOrOffRightBarSearch,
    setActiveTabMessToPriority,
    setActiveTabMessToOrther,
} = chatSlice.actions;
export default chatSlice.reducer;
