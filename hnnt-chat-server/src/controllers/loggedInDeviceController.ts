import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { AuthRequest } from '../types/authRequest'; // Import AuthRequest type

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
        await prisma.loggedInDevice.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete device' });
    }
};

export const logoutOtherDevices = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const { currentDeviceId } = req.body;

        await prisma.loggedInDevice.deleteMany({
            where: {
                userId,
                NOT: { deviceId: currentDeviceId },
            },
        });

        res.json({ message: 'Logged out from all other devices' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to logout other devices' });
    }
};
