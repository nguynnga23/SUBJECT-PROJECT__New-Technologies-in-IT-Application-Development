import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface User {
    number: string;
    id: string;
    name: string;
    email: string;
    password: string;
    avatar: string | null;
    status: string | null;
    birthDate: Date | null;
    location: string | null;
    gender: string;
    currentAvatars: string[];
    createdAt: Date;
    updatedAt: Date;
}

interface AuthRequest extends Request {
    user?: User;
}

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { name, gender, birthDate } = req.body;

        if (!name && !gender && !birthDate) {
            res.status(400).json({ message: 'No data provided to update' });
            return;
        }

        const updateData: any = {};
        if (name) updateData.name = name;
        if (gender) updateData.gender = gender;
        if (birthDate) {
            const parsedDate = new Date(birthDate);
            if (isNaN(parsedDate.getTime())) {
                res.status(400).json({ message: 'Invalid birthDate format' });
                return;
            }
            updateData.birthDate = parsedDate;
        }

        const updatedUser = await prisma.account.update({
            where: { id: userId },
            data: updateData,
        });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const updateAvatar = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { image } = req.body;

        if (!image) {
            res.status(400).json({ message: 'No avatar provided' });
            return;
        }

        const updatedUser = await prisma.account.update({
            where: { id: userId },
            data: { avatar: image },
        });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
