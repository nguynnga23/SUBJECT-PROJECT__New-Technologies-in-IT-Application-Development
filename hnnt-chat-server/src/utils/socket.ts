import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { prisma } from '../prisma/client'; // Import Prisma client
import { Expo } from 'expo-server-sdk';

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

    const expo = new Expo();

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

        socket.on('friend_request_accepted', ({ userId, friendId }) => {
            console.log(userId, friendId);
            io.emit('update_friend_list', { userId, friendId });
        });

        socket.on('friend_request_sent', async ({ receiverId }) => {
            console.log(receiverId);
            io.emit('notify_friend_request', { receiverId });

            try {
                // Fetch the push token of the receiver from the database
                const receiver = await prisma.account.findUnique({
                    where: { id: receiverId },
                    select: { pushToken: true },
                });

                if (receiver?.pushToken && Expo.isExpoPushToken(receiver.pushToken)) {
                    const messages = [
                        {
                            to: receiver.pushToken,
                            sound: 'default',
                            title: 'Friend Request',
                            body: 'You have received a new friend request!',
                            data: { type: 'friend_request' },
                        },
                    ];

                    const ticketChunk = await expo.sendPushNotificationsAsync(messages);
                    console.log('Push notification sent:', ticketChunk);
                } else {
                    console.warn(`Invalid or missing push token for receiverId: ${receiverId}`);
                }
            } catch (error) {
                console.error(`Failed to send push notification to receiverId: ${receiverId}`, error);
            }
        });

        socket.on('friend_request_accepted', ({ requestId }) => {
            io.emit('notify_friend_request_accepted', { requestId });
        });

        socket.on('register_push_token', async ({ userId, pushToken }) => {
            console.log(`User ${userId} registered push token: ${pushToken}`);
            try {
                await prisma.account.update({
                    where: { id: userId },
                    data: { pushToken },
                });
                console.log(`Push token saved for user ${userId}`);
            } catch (error) {
                console.error(`Failed to save push token for user ${userId}:`, error);
            }
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
