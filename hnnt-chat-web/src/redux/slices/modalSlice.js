// modalSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { set } from 'date-fns';

const modalSlice = createSlice({
    name: 'modal',
    initialState: {
        showModalCreatePoll: false,
        showModalVotePoll: false,
        valueModalVotePoll: {},
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
        setValueModalVotePoll(state, action) {
            state.valueModalVotePoll = action.payload;
        },
    },
});

export const { showModal, hideModal, toggleModal, setShowModalVotePoll, setValueModalVotePoll } = modalSlice.actions;
export default modalSlice.reducer;
