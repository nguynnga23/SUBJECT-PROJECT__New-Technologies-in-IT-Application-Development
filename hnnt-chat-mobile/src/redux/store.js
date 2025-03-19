// src/redux/store.js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import friendReducer from './reducers/friendReducer';

const store = createStore(friendReducer, applyMiddleware(thunk));

export default store;
