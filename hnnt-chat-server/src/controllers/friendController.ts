import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const sendFriendRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { senderId, receiverId } = req.body;

        if (senderId === receiverId) {
            res.status(400).json({ message: 'Không thể gửi yêu cầu kết bạn cho chính mình!' });
            return;
        }

        //Check senderId and receiverId
        const sender = await prisma.account.findUnique({ where: { id: senderId } });
        const receiver = await prisma.account.findUnique({ where: { id: receiverId } });

        if (!sender || !receiver) {
            res.status(404).json({ message: 'Người dùng không tồn tại!' });
            return;
        }

        // Check existingRequest
        const existingRequest = await prisma.friendRequest.findFirst({
            where: {
                OR: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId },
                ],
            },
        });

        // Check existingFriend
        const existingFriend = await prisma.friend.findFirst({
            where: {
                OR: [
                    { user1Id: senderId, user2Id: receiverId },
                    { user1Id: receiverId, user2Id: senderId },
                ],
            },
        });

        if (existingFriend) {
            res.status(400).json({ message: 'Các bạn đã là bạn của nhau!' });
            return;
        }

        if (existingRequest) {
            res.status(400).json({ message: 'Lời mời kết bạn đã tồn tại!' });
            return;
        }

        const friendRequest = await prisma.friendRequest.create({
            data: { senderId, receiverId },
        });

        res.status(201).json(friendRequest);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

// 📌 Cancel send friend request
export const cancelFriendRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const request = await prisma.friendRequest.findUnique({ where: { id } });

        if (!request) {
            res.status(400).json({ message: 'Lời mời kết bạn không tồn tại!' });
            return;
        }

        await prisma.friendRequest.delete({ where: { id } });

        res.status(200).json({ message: 'Đã hủy lời mời kết bạn!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

// 📌 Accept friend request
export const acceptFriendRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const request = await prisma.friendRequest.findUnique({ where: { id, block: false } });

        if (!request) {
            res.status(400).json({ message: 'Lời mời kết bạn không tồn tại hoặc bạn đã chặn họ!' });
            return;
        }

        // Create Friend
        await prisma.friend.create({
            data: {
                user1Id: request.senderId,
                user2Id: request.receiverId,
            },
        });

        // Delete friendRequest
        await prisma.friendRequest.delete({ where: { id } });

        res.status(200).json({ message: 'Đã chấp nhận lời mời kết bạn!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

// 📌 Delete friend
export const deleteFriend = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const request = await prisma.friend.findUnique({ where: { id } });

        if (!request) {
            res.status(400).json({ message: 'Thông tin bạn bè không tồn tại!' });
            return;
        }

        await prisma.friend.delete({ where: { id } });
        res.status(200).json({ message: 'Đã xóa kết bạn!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

// 📌 Get list friend
export const getListFriend = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params; // id của user

        const friends = await prisma.friend.findMany({
            where: {
                OR: [{ user1Id: userId }, { user2Id: userId }],
            },
            include: {
                user1: true,
                user2: true,
            },
        });

        const friendList = friends.map((friend) => {
            const friendData = friend.user1Id === userId ? friend.user2 : friend.user1;
            return {
                id: friendData.id,
                name: friendData.name,
                number: friendData.number,
                avatar: friendData.avatar,
                status: friendData.status,
                birthDate: friendData.birthDate,
                location: friendData.location,
                gender: friendData.gender,
                createdAt: friendData.createdAt,
            };
        });
        res.json(friendList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

//📌 Get list friend request
export const getListFriendRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params; // id của user

        const friendRequests = await prisma.friendRequest.findMany({
            where: {
                receiverId: userId,
            },
            include: { receiver: true },
        });

        const sentList = friendRequests.map((request) => {
            return {
                id: request.receiver.id,
                name: request.receiver.name,
                number: request.receiver.number,
                avatar: request.receiver.avatar,
                status: request.receiver.status,
                birthDate: request.receiver.birthDate,
                location: request.receiver.location,
                gender: request.receiver.gender,
                createdAt: request.receiver.createdAt,
            };
        });

        res.json(sentList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

//📌 Block request
export const blockRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { senderId, receiverId } = req.body;

        if (senderId === receiverId) {
            res.status(400).json({ message: 'Không block cho chính mình!' });
            return;
        }

        //Check senderId and receiverId
        const sender = await prisma.account.findUnique({ where: { id: senderId } });
        const receiver = await prisma.account.findUnique({ where: { id: receiverId } });

        if (!sender || !receiver) {
            res.status(404).json({ message: 'Người dùng không tồn tại!' });
            return;
        }

        // Check existingRequest
        const existingRequest = await prisma.friendRequest.findFirst({
            where: {
                OR: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId },
                ],
            },
        });

        // Check existingFriend
        const existingFriend = await prisma.friend.findFirst({
            where: {
                OR: [
                    { user1Id: senderId, user2Id: receiverId },
                    { user1Id: receiverId, user2Id: senderId },
                ],
            },
        });

        if (existingFriend) {
            const updatedRequest = await prisma.friend.delete({
                where: { id: existingFriend.id },
            });
            res.json(updatedRequest);
        }

        if (existingRequest) {
            const updatedRequest = await prisma.friendRequest.update({
                where: { id: existingRequest.id },
                data: { senderId: senderId, receiverId: receiverId, block: true },
            });
            res.json(updatedRequest);
        } else {
            const blockRequest = await prisma.friendRequest.create({
                data: { senderId, receiverId, block: true },
            });
            res.status(201).json(blockRequest);
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

//📌 List Block request
export const ListBlockRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params; // id của user

        const blockRequests = await prisma.friendRequest.findMany({
            where: {
                senderId: userId,
                block: true,
            },
            include: { sender: true },
        });

        const sentList = blockRequests.map((request) => {
            return {
                id: request.sender.id,
                name: request.sender.name,
                number: request.sender.number,
                avatar: request.sender.avatar,
                status: request.sender.status,
                birthDate: request.sender.birthDate,
                location: request.sender.location,
                gender: request.sender.gender,
                createdAt: request.sender.createdAt,
            };
        });

        res.json(sentList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

//📌 List Block request
export const CancelBlockRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params; // id của friend request

        const blockRequest = await prisma.friendRequest.findUnique({
            where: {
                id: id,
                block: true,
            },
            include: { sender: true },
        });

        if (blockRequest) {
            const updatedRequest = await prisma.friendRequest.delete({
                where: { id: blockRequest.id },
            });
            res.json(updatedRequest);
        } else {
            res.status(404).json({ message: 'Thông tin không tồn tại!' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};
