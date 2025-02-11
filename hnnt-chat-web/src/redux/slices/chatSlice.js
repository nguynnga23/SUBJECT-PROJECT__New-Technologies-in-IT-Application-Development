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
        emojiObject: null,
        gifObject: null,
        rightBarTab: 'info',
    },
    reducers: {
        sendMessage: (state, action) => {
            const { chatId, content, time, type, fileName, fileSize } = action.payload;
            const chat = state.chats.find((c) => c.id === chatId);

            if (chat) {
                const message = {
                    sender: 0,
                    content: content,
                    time: time,
                    type: type,
                };
                // Nếu có fileName thì thêm vào object
                if (fileName) {
                    message.fileName = fileName;
                }

                // Nếu có fileSize thì thêm vào object
                if (fileSize) {
                    message.fileSize = fileSize;
                }
                chat.messages.push(message);
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
        sendEmoji: (state, action) => {
            state.emojiObject = action.payload;
        },
        sendGif: (state, action) => {
            state.gifObject = action.payload;
        },
        openEmojiTab: (state) => {
            state.showRightBar = true;
            state.rightBarTab = 'sympol';
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
    sendEmoji,
    sendGif,
    openEmojiTab,
} = chatSlice.actions;
export default chatSlice.reducer;
