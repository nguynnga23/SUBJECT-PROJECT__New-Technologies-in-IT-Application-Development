import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { AuthRequest } from '../types/authRequest'; // Import AuthRequest type
import jwt from 'jsonwebtoken';
import redis from '../config/redis';
const prisma = new PrismaClient();

export const getDevices = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id; // Use authenticated user ID
        const devices = await prisma.loggedInDevice.findMany({ where: { userId } });
        res.json(devices);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch devices' });
    }
};

export const addDevice = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id; // Use authenticated user ID
        const { deviceId, deviceName, platform, accessToken, ipAddress } = req.body;
        const device = await prisma.loggedInDevice.create({
            data: { userId, deviceId, deviceName, platform, accessToken, ipAddress },
        });
        res.status(201).json(device);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add device' });
    }
};

export const updateDevice = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { deviceName, platform, accessToken, ipAddress, lastActive } = req.body;
        const updatedDevice = await prisma.loggedInDevice.update({
            where: { id },
            data: { deviceName, platform, accessToken, ipAddress, lastActive },
        });
        res.json(updatedDevice);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update device' });
    }
};

export const deleteDevice = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // 1. Tìm thiết bị theo ID
        const device = await prisma.loggedInDevice.findUnique({ where: { id } });

        if (!device) {
            res.status(404).json({ error: 'Device not found' });
            return;
        }

        // 2. Giải mã token và thêm vào Redis blacklist
        try {
            const decoded: any = jwt.verify(device.accessToken, process.env.JWT_SECRET as string);
            const expiryTime = decoded.exp - Math.floor(Date.now() / 1000);
            await redis.setex(`blacklist:${device.accessToken}`, expiryTime, 'blacklisted');
        } catch (err) {
            console.warn(`Token invalid or expired, skipping blacklist for device ${device.deviceId}`);
        }

        // 3. Xóa thiết bị khỏi bảng
        await prisma.loggedInDevice.delete({ where: { id } });

        res.status(204).send();
    } catch (error) {
        console.error('Error in deleteDevice:', error);
        res.status(500).json({ error: 'Failed to delete device' });
    }
};

export const logoutOtherDevices = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const { currentDeviceId } = req.body;

        // 1. Lấy danh sách tất cả thiết bị của user ngoại trừ thiết bị hiện tại
        const otherDevices = await prisma.loggedInDevice.findMany({
            where: {
                userId,
                NOT: { deviceId: currentDeviceId },
            },
        });

        // 2. Blacklist tất cả accessToken của các thiết bị này
        for (const device of otherDevices) {
            try {
                const decoded: any = jwt.verify(device.accessToken, process.env.JWT_SECRET as string);
                const expiryTime = decoded.exp - Math.floor(Date.now() / 1000);
                await redis.setex(`blacklist:${device.accessToken}`, expiryTime, 'blacklisted');
            } catch (err) {
                console.warn(`Token invalid or expired, skipping blacklist for device ${device.deviceId}`);
            }
        }

        // 3. Xoá các thiết bị đã đăng nhập kia khỏi bảng LoggedInDevice
        await prisma.loggedInDevice.deleteMany({
            where: {
                userId,
                NOT: { deviceId: currentDeviceId },
            },
        });

        res.json({ message: 'Đã đăng xuất khỏi tất cả thiết bị khác thành công' });
    } catch (error) {
        console.error('Error during logoutOtherDevices:', error);
        res.status(500).json({ error: 'Lỗi máy chủ khi logout các thiết bị khác' });
    }
};
