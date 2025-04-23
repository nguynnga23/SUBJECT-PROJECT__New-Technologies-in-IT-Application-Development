// modalSlice.js
import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
    name: 'modal',
    initialState: {
        showModalCreatePoll: false,
        showModalVotePoll: false,
    },
    reducers: {
        showModal: (state) => {
            state.showModalCreatePoll = true;
        },
        hideModal: (state) => {
            state.showModalCreatePoll = false;
        },
        toggleModal: (state) => {
            state.showModalCreatePoll = !state.showModalCreatePoll;
        },
        setShowModalVotePoll(state, action) {
            state.showModalVotePoll = action.payload;
        },
    },
});

export const { showModal, hideModal, toggleModal, setShowModalVotePoll } = modalSlice.actions;
export default modalSlice.reducer;
