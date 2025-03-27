import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types/authRequest';

const prisma = new PrismaClient();

export const GetChatOfUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized - No user ID found' });
            return;
        }

        // Lấy danh sách các chat mà user tham gia
        const chats = await prisma.chat.findMany({
            where: {
                participants: {
                    some: { accountId: userId },
                },
            },
            include: {
                participants: {
                    include: {
                        account: { select: { id: true, name: true, avatar: true } },
                    },
                },
                messages: {
                    orderBy: { time: 'desc' },
                    take: 1, // Lấy tin nhắn mới nhất
                    include: {
                        sender: { select: { id: true, name: true, avatar: true } },
                    },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });

        res.json(chats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

//get chat by id, only participants can get chat
export const GetChatById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const chatId = req.params.chatId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized - No user ID found' });
            return;
        }

        // Check if the user is a participant of the chat
        const chat = await prisma.chat.findFirst({
            where: {
                id: chatId,
                participants: {
                    some: { accountId: userId },
                },
            },
            include: {
                participants: {
                    include: {
                        account: { select: { id: true, name: true, avatar: true } },
                    },
                },
                messages: {
                    orderBy: { time: 'desc' },
                    include: {
                        sender: { select: { id: true, name: true, avatar: true } },
                    },
                },
            },
        });

        if (!chat) {
            res.status(404).json({ message: 'Chat not found or access denied.' });
            return;
        }

        res.json(chat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
}


