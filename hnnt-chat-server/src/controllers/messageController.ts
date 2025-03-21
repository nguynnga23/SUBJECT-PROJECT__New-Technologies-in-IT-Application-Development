import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types/authRequest';

const prisma = new PrismaClient();

export const GetMessageOfChat = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { chatId } = req.params;

        // Kiểm tra xem user có trong chat không
        const participant = await prisma.chatParticipant.findFirst({
            where: { chatId, accountId: userId },
        });
        if (!participant) {
            res.status(403).json({ message: 'Bạn không có quyền truy cập chat này.' });
            return;
        }

        // Lấy tin nhắn từ chat
        const messages = await prisma.message.findMany({
            where: {
                chatId,
                OR: [
                    { deletedBy: { equals: null } }, // Nếu deletedBy là null (không có ai xóa)
                    { NOT: { deletedBy: { has: userId } } }, // Hoặc không chứa userId
                ],
            },
            include: {
                sender: { select: { id: true, name: true, avatar: true } },
                reactions: true,
                replyTo: { select: { sender: { select: { name: true } }, content: true } },
            },
            orderBy: { time: 'asc' },
        });
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

export const SendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { chatId } = req.params;
        const senderId = req.user.id;
        const { content, type, replyToId, fileName, fileType, fileSize } = req.body;

        // Kiểm tra xem user có trong chat không
        const participant = await prisma.chatParticipant.findFirst({
            where: { chatId, accountId: senderId },
        });
        if (!participant) {
            res.status(403).json({ message: 'Bạn không có quyền gửi tin nhắn trong chat này.' });
            return;
        }

        // Tạo tin nhắn mới
        const message = await prisma.message.create({
            data: {
                chatId,
                senderId,
                content,
                type,
                replyToId,
                fileName,
                fileType,
                fileSize,
            },
            include: {
                sender: { select: { id: true, name: true, avatar: true } },
            },
        });

        res.status(201).json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

export const deleteMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { messageId } = req.params;
        const message = await prisma.message.findFirst({
            where: {
                id: messageId,
            },
        });

        if (!message) {
            res.status(404).json({ message: 'Tin nhắn không tồn tại' });
            return;
        }

        // Cập nhật deletedBy để thêm userId
        await prisma.message.update({
            where: { id: messageId },
            data: {
                deletedBy: {
                    push: userId,
                },
            },
        });

        res.status(200).json({ message: 'Đã xóa tin nhắn thành công' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

export const destroyMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { messageId } = req.params;
        const message = await prisma.message.findFirst({
            where: {
                id: messageId,
            },
        });

        if (!message) {
            res.status(404).json({ message: 'Tin nhắn không tồn tại' });
            return;
        }

        // Cập nhật deletedBy để thêm userId
        await prisma.message.update({
            where: { id: messageId },
            data: {
                destroy: true,
            },
        });

        res.status(200).json({ message: 'Đã xóa tin nhắn thành công' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};
