import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types/authRequest';

const prisma = new PrismaClient();

export const getMessageOfChat = async (req: AuthRequest, res: Response): Promise<void> => {
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
                reactions: {
                    select: { user: { select: { id: true, name: true, avatar: true } }, reaction: true, sum: true },
                },
                replyTo: { select: { id: true, sender: { select: { name: true } }, content: true } },
            },
            orderBy: { time: 'asc' },
        });
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
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

        await prisma.chatParticipant.updateMany({
            where: {
                chatId,
                accountId: { not: senderId }, // Lọc những user khác userId hiện tại
            },
            data: {
                readed: false,
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

export const reactionMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { messageId } = req.params;
        const { userId, reaction } = req.body;
        const message = await prisma.message.findFirst({
            where: {
                id: messageId,
            },
        });
        if (!message) {
            res.status(404).json({ message: 'Tin nhắn không tồn tại' });
            return;
        }

        const existingReaction = await prisma.reaction.findFirst({
            where: {
                messageId,
                userId,
            },
        });

        if (existingReaction) {
            if (existingReaction.reaction === reaction) {
                // Nếu reaction giống nhau, tăng sum lên
                const updatedReaction = await prisma.reaction.update({
                    where: { id: existingReaction.id },
                    data: { sum: existingReaction.sum + 1 },
                });

                res.status(200).json({ message: 'Reaction updated', reaction: updatedReaction });
                return;
            } else {
                // Nếu reaction khác, kiểm tra xem reaction đó đã tồn tại chưa
                const newReaction = await prisma.reaction.findFirst({
                    where: { messageId, userId, reaction },
                });

                if (newReaction) {
                    // Nếu đã tồn tại reaction khác cùng loại, tăng sum của reaction đó
                    const updatedNewReaction = await prisma.reaction.update({
                        where: { id: newReaction.id },
                        data: { sum: newReaction.sum + 1 },
                    });

                    res.status(200).json({ message: 'Reaction switched and updated', reaction: updatedNewReaction });
                    return;
                } else {
                    // Nếu chưa có reaction khác, tạo mới
                    const createdReaction = await prisma.reaction.create({
                        data: {
                            messageId,
                            userId,
                            reaction,
                        },
                    });

                    res.status(201).json({ message: 'New reaction added', reaction: createdReaction });
                    return;
                }
            }
        }

        // Nếu chưa có reaction, tạo mới
        const newReaction = await prisma.reaction.create({
            data: {
                messageId,
                userId,
                reaction,
            },
        });

        res.status(201).json({ message: 'Reaction added', reaction: newReaction });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
};

export const removeReactionOfMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { messageId } = req.params;
        const { userId } = req.body;
        const message = await prisma.message.findFirst({
            where: {
                id: messageId,
            },
        });
        if (!message) {
            res.status(404).json({ message: 'Tin nhắn không tồn tại' });
            return;
        }

        const existingReactions = await prisma.reaction.findMany({
            where: {
                messageId,
                userId,
            },
        });
        if (existingReactions.length === 0) {
            res.status(404).json({ message: 'Không có reaction nào để xóa' });
            return;
        }
        // Xóa tất cả reaction của user trên message
        await prisma.reaction.deleteMany({
            where: {
                messageId,
                userId,
            },
        });

        res.status(200).json({ message: 'Đã xóa tất cả reaction của user trên tin nhắn' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
};

export const pinOfMessage = async (req: AuthRequest, res: Response): Promise<void> => {
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

        await prisma.message.update({
            where: { id: messageId },
            data: {
                pin: true,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
};

export const deletePinOfMessage = async (req: AuthRequest, res: Response): Promise<void> => {
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

        await prisma.message.update({
            where: { id: messageId },
            data: {
                pin: false,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
};

export const searchForKeyWord = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.id; // Lấy userId từ token hoặc session
        const keyword = req.query.keyword;

        // Lấy danh sách tất cả các đoạn chat mà user tham gia
        const chatIds = await prisma.chatParticipant.findMany({
            where: { accountId: userId },
            select: { chatId: true },
        });

        const chatIdList = chatIds.map((chat) => chat.chatId);

        // Lấy tất cả tin nhắn từ các đoạn chat này
        const messages = await prisma.message.findMany({
            where: {
                chatId: { in: chatIdList },
                AND: [
                    {
                        OR: [
                            { deletedBy: { equals: null } }, // Nếu deletedBy là null (không có ai xóa)
                            { NOT: { deletedBy: { has: userId } } }, // Hoặc không chứa userId
                        ],
                    },
                    {
                        OR: [
                            {
                                AND: [
                                    { type: 'text' },
                                    { content: { contains: keyword?.toString(), mode: 'insensitive' } },
                                ],
                            },
                            {
                                AND: [
                                    { type: 'file' },
                                    { fileName: { contains: keyword?.toString(), mode: 'insensitive' } },
                                ],
                            },
                        ],
                    },
                ],
            },
            include: {
                sender: { select: { id: true, name: true, avatar: true } }, // Lấy thông tin người gửi
                chat: { select: { id: true, name: true, isGroup: true } }, // Lấy thông tin đoạn chat
            },
            orderBy: {
                time: 'desc', // Sắp xếp tin nhắn theo thời gian giảm dần
            },
        });

        res.json({ messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const searchForKeyWordByChat = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.id; // Lấy userId từ token hoặc session
        const keyword = req.query.keyword;
        const { chatId } = req.params;

        // Lấy tất cả tin nhắn từ các đoạn chat này
        const messages = await prisma.message.findMany({
            where: {
                chatId: chatId,
                AND: [
                    {
                        OR: [
                            { deletedBy: { equals: null } }, // Nếu deletedBy là null (không có ai xóa)
                            { NOT: { deletedBy: { has: userId } } }, // Hoặc không chứa userId
                        ],
                    },
                    {
                        OR: [
                            {
                                AND: [
                                    { type: 'text' },
                                    { content: { contains: keyword?.toString(), mode: 'insensitive' } },
                                ],
                            },
                            {
                                AND: [
                                    { type: 'file' },
                                    { fileName: { contains: keyword?.toString(), mode: 'insensitive' } },
                                ],
                            },
                        ],
                    },
                ],
            },
            include: {
                sender: { select: { id: true, name: true, avatar: true } }, // Lấy thông tin người gửi
                chat: { select: { id: true, name: true, isGroup: true } }, // Lấy thông tin đoạn chat
            },
            orderBy: {
                time: 'desc', // Sắp xếp tin nhắn theo thời gian giảm dần
            },
        });

        res.json({ messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
