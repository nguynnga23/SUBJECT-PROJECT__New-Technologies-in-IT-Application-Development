import jwt from 'jsonwebtoken';

interface UserInfo {
    id: string;
    number: string;
    [key: string]: any; // Cho phép thêm các trường khác
}

const generateToken = async (
    userInfo: UserInfo,
    secretSignature: string,
    tokenLife: string | number,
): Promise<string> => {
    try {
        return jwt.sign(userInfo, secretSignature, {
            algorithm: 'HS256',
            expiresIn: tokenLife,
        });
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

const verifyToken = async (token: string, secretSignature: string): Promise<UserInfo | null> => {
    try {
        return jwt.verify(token, secretSignature) as UserInfo;
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

export const JwtProvider = { generateToken, verifyToken };
