import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import friendService from '../../features/contact/services/FriendService';

// Thunk để lấy danh sách bạn bè
export const fetchFriends = createAsyncThunk('friends/fetchFriends', async (_, { getState }) => {
    const { token } = getState().auth;
    const friends = await friendService.getFriends(token);
    return friends;
});

// Thunk để block một người bạn
export const blockFriend = createAsyncThunk('friends/blockFriend', async (friendId, { getState }) => {
    const { token } = getState().auth;
    await friendService.blockFriend(friendId, token);
    return friendId; // Trả về ID để cập nhật danh sách
});

const friendSlice = createSlice({
    name: 'friends',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFriends.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFriends.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchFriends.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(blockFriend.pending, (state) => {
                state.loading = true;
            })
            .addCase(blockFriend.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter((friend) => friend.id !== action.payload);
            })
            .addCase(blockFriend.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default friendSlice.reducer;
