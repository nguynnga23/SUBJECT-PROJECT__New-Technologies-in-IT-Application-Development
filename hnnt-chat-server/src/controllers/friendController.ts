import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types/authRequest';

const prisma = new PrismaClient();

export const sendFriendRequest = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Lấy senderId từ token thay vì req.body
        const senderId = req.user?.id; // Giả sử token decoded gắn vào req.user
        const { receiverId } = req.body;

        // Kiểm tra senderId có tồn tại từ token không
        if (!senderId) {
            res.status(401).json({ message: 'Không thể xác thực người dùng!' });
            return;
        }

        if (senderId === receiverId) {
            res.status(400).json({ message: 'Không thể gửi yêu cầu kết bạn cho chính mình!' });
            return;
        }

        // Check senderId and receiverId
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

export const cancelFriendRequest = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params; // ID of the friendRequest
        const userId = req.user?.id; // ID of the logged-in user (from token)

        // Check if userId exists
        if (!userId) {
            res.status(401).json({ message: 'Không thể xác thực người dùng!' });
            return;
        }

        // Find the friendRequest and check if the user is either the sender or receiver
        const request = await prisma.friendRequest.findUnique({
            where: { id },
        });

        if (!request || (request.senderId !== userId && request.receiverId !== userId)) {
            res.status(400).json({
                message: 'Lời mời kết bạn không tồn tại hoặc bạn không có quyền hủy!',
            });
            return;
        }

        // Delete the friendRequest
        await prisma.friendRequest.delete({ where: { id } });

        res.status(200).json({ message: 'Đã hủy lời mời kết bạn!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

// 📌 Accept friend request
export const acceptFriendRequest = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params; // ID của friendRequest
        const userId = req.user?.id; // ID của người đang đăng nhập (lấy từ token)

        // Kiểm tra userId từ token
        if (!userId) {
            res.status(401).json({ message: 'Không thể xác thực người dùng!' });
            return;
        }

        // Tìm friendRequest và kiểm tra xem người đăng nhập có phải là receiver không
        const request = await prisma.friendRequest.findUnique({
            where: {
                id,
                block: false,
                receiverId: userId, // Đảm bảo chỉ receiver mới có thể chấp nhận
            },
        });

        if (!request) {
            res.status(400).json({
                message: 'Lời mời kết bạn không tồn tại, đã bị chặn, hoặc bạn không có quyền chấp nhận!',
            });
            return;
        }

        // Kiểm tra xem đã là bạn chưa (để tránh trùng lặp)
        const existingFriend = await prisma.friend.findFirst({
            where: {
                OR: [
                    { user1Id: request.senderId, user2Id: request.receiverId },
                    { user1Id: request.receiverId, user2Id: request.senderId },
                ],
            },
        });

        if (existingFriend) {
            // Nếu đã là bạn, xóa request và trả về thông báo
            await prisma.friendRequest.delete({ where: { id } });
            res.status(400).json({ message: 'Các bạn đã là bạn của nhau!' });
            return;
        }

        // Tạo mối quan hệ bạn bè
        await prisma.friend.create({
            data: {
                user1Id: request.senderId,
                user2Id: request.receiverId,
            },
        });

        // Xóa friendRequest
        await prisma.friendRequest.delete({ where: { id } });

        res.status(200).json({ message: 'Đã chấp nhận lời mời kết bạn!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

// 📌 Delete friend
export const deleteFriend = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params; // ID of the friend (friendId)
        const userId = req.user?.id; // ID of the logged-in user (from token)

        // Check if userId exists
        if (!userId) {
            res.status(401).json({ message: 'Không thể xác thực người dùng!' });
            return;
        }

        // Find the friendship relationship where the user is either user1 or user2
        const friendship = await prisma.friend.findFirst({
            where: {
                OR: [
                    { user1Id: userId, user2Id: id },
                    { user1Id: id, user2Id: userId },
                ],
            },
        });

        if (!friendship) {
            res.status(400).json({
                message: 'Mối quan hệ bạn bè không tồn tại hoặc bạn không có quyền xóa!',
            });
            return;
        }

        // Delete the friendship relationship
        await prisma.friend.delete({ where: { id: friendship.id } });

        res.status(200).json({ message: 'Đã xóa kết bạn!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

// 📌 Get list friend
export const getListFriend = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized - No user ID found' });
            return;
        }

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
                avatar: friendData.avatar,
                status: friendData.status,
            };
        });

        res.json(friendList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

//📌 Get list friend request
export const getListFriendRequest = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id; // Lấy ID của user từ token, không cần từ params

        // Kiểm tra userId từ token
        if (!userId) {
            res.status(401).json({ message: 'Không thể xác thực người dùng!' });
            return;
        }

        // Lấy danh sách lời mời kết bạn mà user này nhận được
        const friendRequests = await prisma.friendRequest.findMany({
            where: {
                receiverId: userId, // Lời mời gửi đến user hiện tại
            },
            include: {
                sender: true, // Lấy thông tin của người gửi lời mời
            },
        });

        // Map dữ liệu để trả về thông tin của sender
        const receivedList = friendRequests.map((request) => ({
            requestId: request.id, // ID của friendRequest để dùng cho accept/cancel
            senderId: request.sender.id,
            name: request.sender.name,
            number: request.sender.number,
            avatar: request.sender.avatar,
            status: request.sender.status,
            birthDate: request.sender.birthDate,
            location: request.sender.location,
            gender: request.sender.gender,
            createdAt: request.createdAt, // Thời gian tạo lời mời
        }));

        res.status(200).json(receivedList);
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

//📌 Get list friend request by sender
export const getListFriendRequestBySender = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id; // Lấy ID của user từ token, không cần từ params

        // Kiểm tra userId từ token
        if (!userId) {
            res.status(401).json({ message: 'Không thể xác thực người dùng!' });
            return;
        }

        const friendRequests = await prisma.friendRequest.findMany({
            where: {
                senderId: userId,
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

// Cancel friend request by senderId and receiverId
export const cancelFriendRequestBySender = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const senderId = req.user?.id; // Lấy senderId từ token
        if (!senderId) {
            res.status(401).json({ message: 'Không thể xác thực người dùng!' });
            return;
        }

        // Lấy receiverId từ params
        const receiverId = req.params.receiverId; // Lấy receiverId từ params

        // Kiểm tra senderId và receiverId có tồn tại không
        if (!senderId || !receiverId) {
            res.status(400).json({ message: 'Thiếu thông tin senderId hoặc receiverId!' });
            return;
        }

        // Kiểm tra xem có tồn tại yêu cầu kết bạn giữa sender và receiver không
        const existingRequest = await prisma.friendRequest.findFirst({
            where: {
                OR: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId },
                ],
            },
        });

        if (!existingRequest) {
            res.status(404).json({ message: 'Không tìm thấy yêu cầu kết bạn!' });
            return;
        }

        // Xóa yêu cầu kết bạn
        await prisma.friendRequest.delete({ where: { id: existingRequest.id } });

        res.status(200).json({ message: 'Đã hủy yêu cầu kết bạn!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};

// /friends/check-friend/:friendId
export const checkFriend = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id; // Lấy ID của user từ token
        const friendId = req.params.friendId; // Lấy ID của bạn bè từ params

        // Kiểm tra userId từ token
        if (!userId) {
            res.status(401).json({ message: 'Không thể xác thực người dùng!' });
            return;
        }

        // Kiểm tra xem có tồn tại mối quan hệ bạn bè giữa user và friend không
        const friendship = await prisma.friend.findFirst({
            where: {
                OR: [
                    { user1Id: userId, user2Id: friendId },
                    { user1Id: friendId, user2Id: userId },
                ],
            },
        });

        if (friendship) {
            res.status(200).json({ result: true, message: 'Các bạn đã là bạn của nhau!' });
        } else {
            res.status(404).json({ result: false, message: 'Không tìm thấy mối quan hệ bạn bè!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: (error as Error).message });
    }
};
