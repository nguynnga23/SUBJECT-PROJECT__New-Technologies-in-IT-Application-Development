import { createSlice } from '@reduxjs/toolkit';

const messageSlice = createSlice({
    name: 'messages',
    initialState: {
        messages: {}, //{chatId: [tin nhắn]}
    },
    reducers: {
        setMessages: (state, action) => {
            state.messages[action.payload.chatId] = action.payload.messages;
        },
        addMessage: (state, action) => {
            const { chatId, message } = action.payload;
            if (!state.messages[chatId]) {
                state.messages[chatId] = [];
            }
            state.message[chatId].push(message);
        },
    },
});

export const { setMessages, addMessage } = messageSlice.actions;
export default messageSlice.reducer;
