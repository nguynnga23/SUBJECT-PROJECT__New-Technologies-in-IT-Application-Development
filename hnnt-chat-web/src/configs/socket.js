import { io } from 'socket.io-client';

export const socket = io('http://localhost:4000', {
    withCredentials: true,
    transports: ['websocket'], // Dùng websocket thay vì polling
});

socket.on('connect', () => {
    console.log('🔌 Đã kết nối đến server socket:', socket.id);
});

socket.on('disconnect', () => {
    console.log('❌ Socket bị mất kết nối!');
});
