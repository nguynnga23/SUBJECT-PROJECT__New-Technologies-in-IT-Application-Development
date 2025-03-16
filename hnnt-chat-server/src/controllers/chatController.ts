import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getChatOfUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

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
