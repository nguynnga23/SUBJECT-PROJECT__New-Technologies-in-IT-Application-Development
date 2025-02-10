import { createSlice } from '@reduxjs/toolkit';
import { data } from '../../sample_data/listMess';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: data, //Danh sách các cuộc trò chuyện
        activeChat: null, // ID cuộc trò chuyện đang mở
        showRightBar: false,
        showRightBarSearch: false,
        activeTabMess: 'priority',
    },
    reducers: {
        sendMessage: (state, action) => {
            const { chatId, content, time } = action.payload;
            const chat = state.chats.find((c) => c.id === chatId);

            if (chat) {
                chat.messages.push({
                    sender: 0,
                    content: content,
                    time: time,
                });
            }
        },
        setActiveChat: (state, action) => {
            state.activeChat = action.payload;
        },
        setShowOrOffRightBar: (state, action) => {
            state.showRightBar = action.payload;
            state.showRightBarSearch = false;
        },
        setShowOrOffRightBarSearch: (state, action) => {
            state.showRightBarSearch = action.payload;
            state.showRightBar = false;
        },
        setActiveTabMessToPriority: (state) => {
            state.activeTabMess = 'priority';
        },
        setActiveTabMessToOrther: (state) => {
            state.activeTabMess = 'other';
        },
        setOnOrOfPin: (state) => {
            state.activeChat.pin = !state.activeChat.pin;
        },
        setOnOrOfNotify: (state) => {
            state.activeChat.notify = !state.activeChat.notify;
        },
    },
});

export const {
    sendMessage,
    setActiveChat,
    setShowOrOffRightBar,
    setShowOrOffRightBarSearch,
    setActiveTabMessToPriority,
    setActiveTabMessToOrther,
    setOnOrOfPin,
    setOnOrOfNotify,
} = chatSlice.actions;
export default chatSlice.reducer;
