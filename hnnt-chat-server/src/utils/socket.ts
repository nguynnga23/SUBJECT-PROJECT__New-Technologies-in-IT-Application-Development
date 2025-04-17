import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export let io: Server;
const userSocketMap = new Map<string, string>();
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

        // Lắng nghe khi client gửi userId lên sau khi đăng nhập
        socket.on('register', (userId) => {
            userSocketMap.set(userId, socket.id);

            console.log(`📝 User ${userId} registered with socket ${socket.id}`);
            console.log('userSocketMap:', Array.from(userSocketMap.entries()));
        });

        socket.on('call_user', ({ to, from, meetingId }) => {
            const toSocketId = userSocketMap.get(to);
            if (toSocketId) {
                io.to(toSocketId).emit('incoming_call', { from, meetingId });
                console.log(`📞 Gửi cuộc gọi từ ${from} đến ${to}`);
            } else {
                console.log(`❌ Không tìm thấy socketId cho userId ${to}`);
            }
        });

        // Khi người dùng nhận cuộc gọi
        socket.on('accept_call', ({ from, to, meetingId }) => {
            io.to(from).emit('call_accepted', { to, meetingId }); // Gửi thông báo cuộc gọi được nhận
        });

        // Khi người dùng từ chối cuộc gọi
        socket.on('reject_call', ({ from, to }) => {
            io.to(from).emit('call_rejected', { to }); // Gửi thông báo cuộc gọi bị từ chối
        });

        socket.on('disconnect', () => {
            // Xóa socket khỏi map
            for (let [userId, id] of userSocketMap.entries()) {
                if (id === socket.id) {
                    userSocketMap.delete(userId);
                    break;
                }
            }
            console.log(`❌ Client disconnected: ${socket.id}`);
        });
    });

    console.log(`✅ Socket.IO đã khởi động`);
};
