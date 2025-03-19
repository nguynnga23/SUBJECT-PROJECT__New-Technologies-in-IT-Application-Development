// src/redux/actions/friendActions.js
export const FETCH_FRIENDS_REQUEST = 'FETCH_FRIENDS_REQUEST';
export const FETCH_FRIENDS_SUCCESS = 'FETCH_FRIENDS_SUCCESS';
export const FETCH_FRIENDS_FAILURE = 'FETCH_FRIENDS_FAILURE';

import { getFriendList } from '../../services/friendService';

export const fetchFriends = (userId) => async (dispatch) => {
    try {
        dispatch({ type: FETCH_FRIENDS_REQUEST });
        const friends = await getFriendList(userId);
        dispatch({
            type: FETCH_FRIENDS_SUCCESS,
            payload: friends,
        });
    } catch (error) {
        dispatch({
            type: FETCH_FRIENDS_FAILURE,
            payload: error.message,
        });
    }
};
