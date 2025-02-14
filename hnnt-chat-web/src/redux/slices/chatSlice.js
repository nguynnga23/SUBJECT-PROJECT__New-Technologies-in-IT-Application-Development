import { createSlice } from '@reduxjs/toolkit';
import { data } from '../../sample_data/listMess';
import { v4 as uuidv4 } from 'uuid';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: data, //Danh sách các cuộc trò chuyện
        activeChat: null, // cuộc trò chuyện đang mở
        showRightBar: false,
        showRightBarSearch: false,
        activeTabMess: 'priority',
        emojiObject: null,
        gifObject: null,
        sticker: null,
        rightBarTab: 'info',
    },
    reducers: {
        sendMessage: (state, action) => {
            const { chatId, content, time, type, fileName, fileSize, fileType } = action.payload;
            const chat = state.chats.find((c) => c.id === chatId);

            if (chat) {
                const message = {
                    id: uuidv4(),
                    sender: 0,
                    content: content,
                    time: time,
                    type: type,
                    delete: false,
                    destroy: false,
                };
                // Nếu có fileName thì thêm vào object
                if (fileName) {
                    message.fileName = fileName;
                }

                // Nếu có fileSize thì thêm vào object
                if (fileSize) {
                    message.fileSize = fileSize;
                }
                // Nếu có fileType thì thêm vào object
                if (fileType) {
                    message.fileType = fileType;
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
        sendSticker: (state, action) => {
            state.sticker = action.payload;
        },
        openEmojiTab: (state) => {
            state.showRightBar = true;
            state.rightBarTab = 'sympol';
        },
        updateMessageStatus: (state, action) => {
            const { chatId, messageId, statusType } = action.payload;

            // Kiểm tra chat có tồn tại không
            const chat = state.chats.find((chat) => chat.id === chatId);
            if (!chat) return;

            // Kiểm tra message có tồn tại không
            const message = chat.messages.find((msg) => msg.id === messageId);
            if (message) {
                message[statusType] = !message[statusType]; // Đảo trạng thái true/false
            }

            // Cập nhật activeChat nếu nó là chat hiện tại
            if (state.activeChat?.id === chatId) {
                const activeMessage = state.activeChat.messages.find((msg) => msg.id === messageId);
                if (activeMessage) {
                    activeMessage[statusType] = !activeMessage[statusType];
                }
            }
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
    updateMessageStatus,
    sendSticker,
} = chatSlice.actions;
export default chatSlice.reducer;
