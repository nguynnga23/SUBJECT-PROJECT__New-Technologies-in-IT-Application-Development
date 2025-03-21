// Author: TrungQuanDev: https://youtube.com/@trungquandev

import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

interface UserInfo {
    id: string;
    name: string;
    [key: string]: any;
}

const generateToken = async (
    userInfo: UserInfo,
    secretSignature: string,
    tokenLife: string | number,
): Promise<string> => {
    try {
        if (!secretSignature) {
            throw new Error('Thiếu khóa bí mật để tạo token!');
        }

        const options: SignOptions = {
            algorithm: 'HS256',
            expiresIn: typeof tokenLife === 'string' ? parseInt(tokenLife) : tokenLife,
        };

        return jwt.sign(userInfo, secretSignature, options);
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

const verifyToken = async (token: string, secretSignature: string): Promise<UserInfo | null> => {
    try {
        if (!secretSignature) {
            throw new Error('Thiếu khóa bí mật để xác thực token!');
        }

        const decoded = jwt.verify(token, secretSignature);

        if (typeof decoded === 'string') {
            return null; // Tránh lỗi khi verify trả về string thay vì object
        }

        return decoded as UserInfo;
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

export const JwtProvider = { generateToken, verifyToken };
