import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import friendRouter from './src/routes/friendRoutes';
import chatRouter from './src/routes/chatRoutes';
import messageRouter from './src/routes/messageRoutes';
import authRouter from './src/routes/authRoutes';
import contactRouter from './src/routes/contactRoutes';
import groupChatManageRouter from './src/routes/groupChatManageRoutes';

import userRouter from './src/routes/userRoutes';

import categoryRouter from './src/routes/categoryRoutes';
import { initSocket } from './src/utils/socket';
import loggedInDeviceRouter from './src/routes/loggedInDeviceRoutes';

import http from 'http';
import https from 'https';
import { URL } from 'url';
import pollRouter from './src/routes/pollRoutes';

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
initSocket(server);

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
app.use('/api/contacts', contactRouter);
app.use('/api/groups', groupChatManageRouter);
app.use('/api/loggedin-devices', loggedInDeviceRouter);
app.use('/api/contacts', contactRouter);
app.use('/api/polls', pollRouter);

app.get('/api/public-download', async (req, res) => {
    const fileUrl = req.query.url as string;
    const filename = req.query.name || 'downloaded_file';

    if (!fileUrl) {
        res.status(400).send('Missing url parameter');
        return;
    }

    try {
        const parsedUrl = new URL(fileUrl);
        const protocol = parsedUrl.protocol === 'https:' ? https : http;

        protocol
            .get(fileUrl, (fileRes) => {
                if (fileRes.statusCode !== 200) {
                    res.status(fileRes.statusCode || 500).send('Failed to fetch file from S3');
                    return;
                }

                res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
                res.setHeader('Content-Type', fileRes.headers['content-type'] || 'application/octet-stream');

                fileRes.pipe(res);
            })
            .on('error', (err) => {
                console.error('Stream error:', err);
                res.status(500).send('Failed to download file');
            });
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).send('Download failed');
    }
});

server.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});
