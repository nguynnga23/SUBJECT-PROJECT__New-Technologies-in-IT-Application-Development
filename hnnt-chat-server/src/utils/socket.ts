import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export let io: Server;
export const initSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: `http://localhost:3000`, // Frontend chạy ở đây
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log(`⚡ Client connected: ${socket.id}`);

        socket.on('send_message', (message) => {
            console.log('📨 Tin nhắn mới:', message);
            io.emit('receive_message', message);
        });

        socket.on('read_message', ({ chatId }) => {
            console.log(`👀 Tin nhắn ${chatId} đã đọc`);
            io.to(chatId).emit('read_message', { chatId });
        });

        socket.on('disconnect', () => {
            console.log(`❌ Client disconnected: ${socket.id}`);
        });
    });

    console.log(`✅ Socket.IO đã khởi động`);
};
