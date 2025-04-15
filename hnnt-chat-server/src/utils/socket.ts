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

        socket.on('send_message', ({ chatId, newMessage }) => {
            io.emit('receive_message', { chatId, newMessage });
        });
        socket.on('reaction_message', ({ chatId }) => {
            io.emit('receive_reaction_message', { chatId });
        });
        socket.on('pin_message', ({ chatId }) => {
            io.emit('receive_pin_message', { chatId });
        });

        // socket.on('read_chat', ({ chatId, userId }) => {
        //     console.log('ac', chatId);

        //     io.emit('receive_read_chat', { chatId, userId });
        // });
	
	socket.on('del_message', ({ chatId }) => {
            io.emit('render_message', { chatId });
        });

        socket.on('disconnect', () => {
            console.log(`❌ Client disconnected: ${socket.id}`);
        });
    });

    console.log(`✅ Socket.IO đã khởi động`);
};
