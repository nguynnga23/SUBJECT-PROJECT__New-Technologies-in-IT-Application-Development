import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import categories from '../../sample_data/listCategory';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        userActive: null,
        chats: [], //Danh sách các cuộc trò chuyện
        groups: [],
        data: [],
        categories: categories,
        activeChat: null, // cuộc trò chuyện đang mở
        showRightBar: false,
        showRightBarSearch: false,
        activeTabMess: 'priority',
        emojiObject: null,
        rightBarTab: 'info',
        rightBarTabSub: 'emoji',
        searchResults: [],
    },
    reducers: {
        setChats: (state, action) => {
            state.userActive = action.payload.userActive;
            state.chats = action.payload.chats;
            state.groups = action.payload.groups;
            state.data = [...action.payload.chats, ...action.payload.groups];
        },
        sendMessage: (state, action) => {
            const { chatId, content, time, type, fileName, fileSize, fileType, reply } = action.payload;
            const chat = state.data.find((c) => c.id === chatId);

            if (chat) {
                const message = {
                    id: uuidv4(),
                    sender: state.userActive.id,
                    name: state.userActive.name,
                    avatar: state.userActive.avatar,
                    content: content,
                    time: time,
                    type: type,
                    delete: [],
                    destroy: false,
                    reactions: [],
                    seem: true,
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

                if (reply) {
                    message.reply = reply;
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
        setReadedChatWhenSendNewMessage: (state, action) => {
            const { chatId, userId } = action.payload;
            if (state.activeChat && state.activeChat.id === chatId) {
                state.activeChat.participants = state.activeChat.participants.map((user) =>
                    user.accountId !== userId ? { ...user, readed: false } : user,
                );
            }
        },
        setSeemAllChat: (state) => {
            state.data.filter((c) => (c.seem = true));
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
            if (state.activeChat && state.activeChat.id === action.payload.chatId) {
                state.activeChat.participants = state.activeChat.participants.map((user) =>
                    user.accountId === action.payload.userId ? { ...user, pin: action.payload.pinStatus } : user,
                );
            }
        },
        setOnOrOfNotify: (state, action) => {
            if (state.activeChat && state.activeChat.id === action.payload.chatId) {
                state.activeChat.participants = state.activeChat.participants.map((user) =>
                    user.accountId === action.payload.userId ? { ...user, notify: action.payload.notifyStatus } : user,
                );
            }
        },
        sendEmoji: (state, action) => {
            state.emojiObject = action.payload;
        },

        openEmojiTab: (state, action) => {
            state.showRightBar = true;
            state.showRightBarSearch = false;
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
            const userActive = state.userActive;

            const chat = state.data.find((chat) => chat.id === chatId);
            if (!chat) return;

            const message = chat.messages.find((mess) => mess.id === messageId);
            if (!message) return;

            const existingUserReaction = message.reactions.find((r) => r.id === userId && r.reaction === reaction);

            if (existingUserReaction) {
                existingUserReaction.sum += 1;
            } else {
                // Nếu reaction chưa tồn tại, thêm mới
                message.reactions.push({
                    id: userId,
                    name: userActive.name,
                    avatar: userActive.avatar,
                    reaction,
                    sum: 1,
                });
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
            const { chatId, userId, category } = action.payload;
            if (state.activeChat && state.activeChat.id === chatId) {
                state.activeChat.participants = state.activeChat.participants.map((user) =>
                    user.accountId === userId
                        ? { ...user, category: user.category === category ? null : category }
                        : user,
                );
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
                leader: state.userActive.id,
                members: [state.userActive, ...members],
                messages: [],
                seem: true,
            };
            state.data.push(newGroup);
        },
        addMemberToGroup: (state, action) => {
            const { groupId, members } = action.payload;
            const group = state.data.find((g) => g.id === groupId);
            group.members = [
                ...group.members,
                ...members.filter((newMember) => !group.members.some((member) => member.id === newMember.id)),
            ];
        },
        removeMemberOfGroup: (state, action) => {
            const { memberId, groupId } = action.payload;

            return {
                ...state,
                data: state.data.map((group) =>
                    group.id === groupId
                        ? { ...group, members: group.members.filter((m) => m.id !== memberId) }
                        : group,
                ),
            };
        },

        destroyGroup: (state, action) => {
            const { groupId } = action.payload;
            return {
                ...state,
                data: state.data.filter((group) => group.id !== groupId),
            };
        },

        searchFollowKeyWord: (state, action) => {
            const { keyword } = action.payload;
            if (!keyword.trim()) {
                return { ...state, searchResults: [] };
            }

            return {
                ...state,
                searchResults: state.data.flatMap((group) =>
                    group.messages.filter(
                        (message) =>
                            !message.destroy &&
                            ((message.type === 'text' &&
                                message.content.toLowerCase().includes(keyword.toLowerCase())) ||
                                (message.type === 'file' &&
                                    message.fileName?.toLowerCase().includes(keyword.toLowerCase()))),
                    ),
                ),
            };
        },
    },
});

export const {
    setChats,
    setReadedChatWhenSendNewMessage,
    setSeemAllChat,
    sendMessage,
    setActiveChat,
    setShowOrOffRightBar,
    setShowOrOffRightBarSearch,
    setActiveTabMessToPriority,
    setActiveTabMessToOrther,
    setOnOrOfPin,
    setOnOrOfNotify,
    sendEmoji,
    openEmojiTab,
    updateMessageStatus,
    addReaction,
    removeReaction,
    addOrChangeCategory,
    deleteChatForUser,
    createGroup,
    addMemberToGroup,
    removeMemberOfGroup,
    destroyGroup,
    searchFollowKeyWord,
} = chatSlice.actions;
export default chatSlice.reducer;
