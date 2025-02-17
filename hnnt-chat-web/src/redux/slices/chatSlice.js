import { createSlice } from '@reduxjs/toolkit';
import chats from '../../sample_data/listMess';
import { v4 as uuidv4 } from 'uuid';
import categories from '../../sample_data/listCategory';
import groups from '../../sample_data/listGroup';
import userActive from '../../sample_data/userActive';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: chats, //Danh sách các cuộc trò chuyện
        groups: groups.filter((g) => g.members?.some((m) => m.id === userActive.id)),
        data: chats.concat(groups.filter((g) => g.members?.some((m) => m.id === userActive.id))),
        categories: categories,
        activeChat: null, // cuộc trò chuyện đang mở
        showRightBar: false,
        showRightBarSearch: false,
        activeTabMess: 'priority',
        emojiObject: null,
        gifObject: null,
        sticker: null,
        rightBarTab: 'info',
        rightBarTabSub: 'emoji',
    },
    reducers: {
        sendMessage: (state, action) => {
            const { chatId, content, time, type, fileName, fileSize, fileType } = action.payload;
            const chat = state.data.find((c) => c.id === chatId);

            if (chat) {
                const message = {
                    id: uuidv4(),
                    sender: 0,
                    content: content,
                    time: time,
                    type: type,
                    delete: [],
                    destroy: false,
                    reactions: [],
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
        deleteChatForUser: (state, action) => {
            const { userId, chatId } = action.payload;
            const chat = state.data.find((c) => c.id === chatId);
            if (chat) {
                chat.messages.forEach((msg) => {
                    // Kiểm tra nếu `userId` chưa tồn tại trong mảng
                    if (!msg.delete.some((m) => m.id === userId)) {
                        msg.delete.push({ id: userId });
                    }
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
        setOnOrOfPin: (state, action) => {
            const chatId = action.payload;

            const chat = state.data.find((c) => c.id === chatId);
            if (chat) {
                chat.pin = !chat.pin;
            }
        },
        setOnOrOfNotify: (state, action) => {
            const chatId = action.payload;

            const chat = state.data.find((c) => c.id === chatId);
            if (chat) {
                chat.notify = !chat.notify;
            }
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
        openEmojiTab: (state, action) => {
            state.showRightBar = true;
            state.rightBarTab = 'sympol';
            state.rightBarTabSub = action.payload;
        },
        updateMessageStatus: (state, action) => {
            const { chatId, messageId, statusType, userId } = action.payload;

            // Kiểm tra chat có tồn tại không
            const chat = state.data.find((chat) => chat.id === chatId);
            if (!chat) return;
            // Kiểm tra message có tồn tại không
            const message = chat.messages.find((msg) => msg.id === messageId);
            if (statusType === 'delete') {
                message[statusType].push({ id: userId });
            } else {
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
            }
        },

        addReaction: (state, action) => {
            const { chatId, messageId, reaction, userId } = action.payload;

            const chat = state.data.find((chat) => chat.id === chatId);

            if (chat) {
                const message = chat.messages.find((mess) => mess.id === messageId);
                if (message) {
                    const existingReaction = message.reactions.find((r) => r.reaction === reaction);
                    if (existingReaction) {
                        existingReaction.sum += 1;
                    } else {
                        message.reactions = [...message.reactions, { id: userId, reaction, sum: 1 }];
                    }
                }
            }
        },
        removeReaction: (state, action) => {
            const { chatId, messageId, userId } = action.payload;

            const chat = state.data.find((chat) => chat.id === chatId);

            if (chat) {
                const message = chat.messages.find((mess) => mess.id === messageId);
                if (message) {
                    message.reactions = message.reactions.filter((reaction) => reaction.id !== userId);
                }
            }
        },
        addOrChangeCategory: (state, action) => {
            const { chatId, category } = action.payload;
            const chat = state.data.find((msg) => msg.id === chatId);
            if (chat) {
                chat.category = category;
                const cat = state.categories.find((c) => c.name === category.name);
                if (cat) {
                    chat.categoryColor = cat.color;
                }
            }
        },
        createGroup: (state, action) => {
            const { name, avatar, members } = action.payload;
            const newGroup = {
                id: uuidv4(), // Tạo ID ngẫu nhiên
                name,
                avatar: avatar,
                pin: false,
                notify: true,
                kind: 'priority',
                category: '',
                categoryColor: '',
                delete: [],
                group: true,
                members: [...members, userActive],
                messages: [],
            };
            state.data.push(newGroup);
            console.log(state.data.map((a) => console.log(a)));
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
    addReaction,
    removeReaction,
    addOrChangeCategory,
    deleteChatForUser,
    createGroup,
} = chatSlice.actions;
export default chatSlice.reducer;
