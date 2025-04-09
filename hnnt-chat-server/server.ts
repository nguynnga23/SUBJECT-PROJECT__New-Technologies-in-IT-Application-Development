import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import friendRouter from './src/routes/friendRoutes';
import chatRouter from './src/routes/chatRoutes';
import messageRouter from './src/routes/messageRoutes';
import authRouter from './src/routes/authRoutes';

import groupChatManageRouter from './src/routes/groupChatManageRoutes';

import userRouter from './src/routes/userRoutes';

import categoryRouter from './src/routes/categoryRoutes';
import { initSocket } from './src/utils/socket';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tạo HTTP server từ Express
const server = createServer(app);
// initSocket(server);

// Routes

app.use(
    cors({
        origin: 'http://localhost:3000', // Frontend chạy ở cổng 3000
        credentials: true, // Cho phép gửi cookie/token
    }),
);
app.use('/api/friends', friendRouter);
app.use('/api/chats', chatRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/messages', messageRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.use('/api/groups', groupChatManageRouter);

app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});
