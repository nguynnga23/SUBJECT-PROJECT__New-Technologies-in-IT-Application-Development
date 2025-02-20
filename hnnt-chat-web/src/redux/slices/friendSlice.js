import { createSlice } from '@reduxjs/toolkit';
import categories from '../../sample_data/listCategory';
import { v4 as uuidv4 } from 'uuid';
import friends from '../../sample_data/listFriend';

const friendSlice = createSlice({
    name: 'friend',
    initialState: {
        friends: friends,
    },
    reducers: {},
});

export const {} = friendSlice.actions;
export default friendSlice.reducer;
