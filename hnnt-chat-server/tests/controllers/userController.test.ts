const mockPrisma = {
    account: {
        findUnique: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
    },
};

jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn(() => mockPrisma),
    };
});

import {
    updateUser,
    updateAvatar,
    changePasswordByToken,
    getUserById,
    getUserByNumberAndEmail,
    getUserByNumberOrEmail,
    searchByPhone,
    searchUsers,
} from '../../src/controllers/userController';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

interface CustomRequest extends Request {
    user?: { id: string };
}

describe('userController', () => {
    let req: Partial<CustomRequest>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        req = { body: {}, params: {}, user: { id: 'test-user-id' } };
        res = { status: statusMock, json: jsonMock };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('updateUser', () => {
        it('should return 400 if no data is provided', async () => {
            req.body = {};
            await updateUser(req as Request, res as Response);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'No data provided to update' });
        });

        it('should update user and return updated user', async () => {
            req.body = { name: 'New Name', gender: 'male', birthDate: '2000-01-01' };
            mockPrisma.account.update.mockResolvedValue({ id: 'test-user-id', name: 'New Name' });

            await updateUser(req as Request, res as Response);

            expect(mockPrisma.account.update).toHaveBeenCalledWith({
                where: { id: 'test-user-id' },
                data: { name: 'New Name', gender: 'male', birthDate: new Date('2000-01-01') },
            });
            expect(jsonMock).toHaveBeenCalledWith({ id: 'test-user-id', name: 'New Name' });
        });
    });

    describe('changePasswordByToken', () => {
        it('should return 400 if passwords are missing', async () => {
            req.body = {};
            await changePasswordByToken(req as Request, res as Response);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Thiếu thông tin' });
        });

        it('should return 400 if current password is incorrect', async () => {
            req.body = { currentPassWord: 'wrong-password', newPassword: 'NewPass123!' };
            mockPrisma.account.findUnique.mockResolvedValue({ password: 'hashed-password' });
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await changePasswordByToken(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Mật khẩu hiện tại không đúng!' });
        });

        it('should update password and return success message', async () => {
            req.body = { currentPassWord: 'correct-password', newPassword: 'NewPass123!' };
            mockPrisma.account.findUnique.mockResolvedValue({ password: 'hashed-password' });
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (bcrypt.hash as jest.Mock).mockResolvedValue('new-hashed-password');
            mockPrisma.account.update.mockResolvedValue({ id: 'test-user-id' });

            await changePasswordByToken(req as Request, res as Response);

            expect(mockPrisma.account.update).toHaveBeenCalledWith({
                where: { id: 'test-user-id' },
                data: { password: 'new-hashed-password' },
            });
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Đặt lại mật khẩu thành công!', success: true });
        });
    });

    describe('getUserById', () => {
        it('should return 404 if user is not found', async () => {
            req.params = { id: 'non-existent-id' };
            mockPrisma.account.findUnique.mockResolvedValue(null);

            await getUserById(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'User not found' });
        });

        it('should return user if found', async () => {
            req.params = { id: 'test-user-id' };
            mockPrisma.account.findUnique.mockResolvedValue({ id: 'test-user-id', name: 'Test User' });

            await getUserById(req as Request, res as Response);

            expect(jsonMock).toHaveBeenCalledWith({ id: 'test-user-id', name: 'Test User' });
        });
    });

    describe('updateAvatar', () => {
        it('should return 400 if no file is provided', async () => {
            req.file = undefined;
            await updateAvatar(req as Request, res as Response);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'No file provided' });
        });

        it('should return 400 if file type is invalid', async () => {
            req.file = { mimetype: 'text/plain' } as Express.Multer.File;
            await updateAvatar(req as Request, res as Response);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Invalid file type. Only images are allowed.' });
        });

        it('should update avatar and return updated user', async () => {
            req.file = { mimetype: 'image/jpeg', buffer: Buffer.from('test') } as Express.Multer.File;
            const mockUploadResult = { Location: 'https://s3.amazonaws.com/test-avatar.jpg' };
            jest.spyOn(require('../../src/utils/s3Uploader'), 'uploadToS3').mockResolvedValue(mockUploadResult);
            mockPrisma.account.update.mockResolvedValue({ id: 'test-user-id', avatar: mockUploadResult.Location });

            await updateAvatar(req as Request, res as Response);

            expect(jsonMock).toHaveBeenCalledWith({ id: 'test-user-id', avatar: mockUploadResult.Location });
        });
    });

    describe('getUserByNumberAndEmail', () => {
        it('should return 400 if both number and email exist', async () => {
            req.body = { number: '123456789', email: 'test@example.com' };
            mockPrisma.account.findFirst.mockResolvedValue({ number: '123456789', email: 'test@example.com' });

            await getUserByNumberAndEmail(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Số điện thoại và email đã tồn tại' });
        });

        it('should return 200 if number and email do not exist', async () => {
            req.body = { number: '123456789', email: 'test@example.com' };
            mockPrisma.account.findFirst.mockResolvedValue(null);

            await getUserByNumberAndEmail(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ exists: true, message: 'Số điện thoại và email chưa tồn tại' });
        });
    });

    describe('getUserByNumberOrEmail', () => {
        it('should return 400 if neither number nor email is provided', async () => {
            req.body = {};
            await getUserByNumberOrEmail(req as Request, res as Response);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Số điện thoại hoặc email phải được cung cấp' });
        });

        it('should return 404 if user is not found', async () => {
            req.body = { number: '123456789' };
            mockPrisma.account.findFirst.mockResolvedValue(null);

            await getUserByNumberOrEmail(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Không tìm thấy người dùng' });
        });

        it('should return user if found', async () => {
            req.body = { number: '123456789' };
            mockPrisma.account.findFirst.mockResolvedValue({ id: 'test-user-id', name: 'Test User' });

            await getUserByNumberOrEmail(req as Request, res as Response);

            expect(jsonMock).toHaveBeenCalledWith({ id: 'test-user-id', name: 'Test User' });
        });
    });

    describe('searchByPhone', () => {
        it('should return 400 if phone number is missing', async () => {
            req.body = {};
            await searchByPhone(req as Request, res as Response);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Missing phone number' });
        });

        it('should return search results', async () => {
            req.body = { number: '123' };
            req.user = { id: 'test-user-id' };
            mockPrisma.account.findMany.mockResolvedValue([
                {
                    id: 'user1',
                    name: 'User 1',
                    number: '123456789',
                    avatar: null,
                    sentFriendRequests: [],
                    receivedFriendRequests: [],
                },
            ]);

            await searchByPhone(req as Request, res as Response);

            expect(jsonMock).toHaveBeenCalledWith([
                {
                    id: 'user1',
                    name: 'User 1',
                    number: '123456789',
                    avatar: null,
                    status: 'none',
                    friendRequestId: null,
                },
            ]);
        });
    });

    describe('searchUsers', () => {
        it('should return search results', async () => {
            req.body = { query: 'test', currentUserId: 'test-user-id' };
            mockPrisma.account.findMany.mockResolvedValue([
                { id: 'user1', name: 'Test User', email: 'test@example.com', avatar: null },
            ]);

            await searchUsers(req as Request, res as Response);

            expect(jsonMock).toHaveBeenCalledWith([
                { id: 'user1', name: 'Test User', email: 'test@example.com', avatar: null },
            ]);
        });

        it('should return 500 on error', async () => {
            req.body = { query: 'test', currentUserId: 'test-user-id' };
            mockPrisma.account.findMany.mockRejectedValue(new Error('Database error'));

            await searchUsers(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Failed to search users' });
        });
    });
});
