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
        }

        const updatedUser = await prisma.account.update({
            where: { id: userId },
            data: { name, gender, birthDate: new Date(birthDate) },
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

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;

        const user = await prisma.account.findUnique({
            where: { id: userId },
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(user);
        return;
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        return;
    }
};

export const getUserByNumberAndEmail = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { number, email } = req.body;

        const existingAccount = await prisma.account.findFirst({
            where: {
                OR: [{ number: number }, { email: email }],
            },
        });

        if (existingAccount) {
            if (existingAccount.number === number && existingAccount.email === email) {
                res.status(400).json({ message: 'Số điện thoại và email đã tồn tại' });
            } else if (existingAccount.email === email) {
                res.status(400).json({ message: 'Email đã tồn tại' });
            } else if (existingAccount.number === number) {
                res.status(400).json({ message: 'Số điện thoại đã tồn tại' });
            }
            return;
        }

        res.status(200).json({ exists: true, message: 'Số điện thoại và email chưa tồn tại' });
        return;
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
