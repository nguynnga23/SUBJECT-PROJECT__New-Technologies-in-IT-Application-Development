import { io } from 'socket.io-client';
import { localhost } from '../utils/localhosts';

export const socket = io(`${localhost}`, {
    withCredentials: true,
    transports: ['websocket'],
    forceNew: true,
});

socket.on('connect', () => {
    console.log('🔌 Đã kết nối đến server socket:', socket.id);
});

socket.on('disconnect', () => {
    console.log('❌ Socket bị mất kết nối!');
});