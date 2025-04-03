import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types/authRequest';

const prisma = new PrismaClient();

export const GetAllCategory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized - No user ID found' });
            return;
        }

        // Lấy danh sách các chat mà user tham gia
        const category = await prisma.category.findMany({
            where: {
                accountId: userId,
            },
        });

        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

export const AddCategory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const { name, color } = req.body;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized - No user ID found' });
            return;
        }

        const checkName = await prisma.category.findFirst({
            where: {
                name,
            },
        });
        if (checkName) {
            // Lấy danh sách các chat mà user tham gia
            res.json({ message: 'Trùng name' });
            return;
        }

        // Lấy danh sách các chat mà user tham gia
        const category = await prisma.category.create({
            data: {
                name,
                color,
                accountId: userId,
            },
        });

        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};
export const DeleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Lấy danh sách các chat mà user tham gia
        const category = await prisma.category.delete({
            where: { id },
        });

        res.json({ message: 'Danh mục đã được xóa thành công.', category });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};
