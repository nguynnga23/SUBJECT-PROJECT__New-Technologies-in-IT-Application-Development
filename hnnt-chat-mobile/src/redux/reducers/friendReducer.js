// src/redux/reducers/friendReducer.js
import { FETCH_FRIENDS_REQUEST, FETCH_FRIENDS_SUCCESS, FETCH_FRIENDS_FAILURE } from '../actions/friendActions';

const initialState = {
    friends: [],
    loading: false,
    error: null,
};

const friendReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_FRIENDS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_FRIENDS_SUCCESS:
            return {
                ...state,
                loading: false,
                friends: action.payload,
            };
        case FETCH_FRIENDS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default friendReducer;
