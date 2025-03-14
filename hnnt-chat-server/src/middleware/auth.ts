import { Request, Response, NextFunction } from 'express';
import { JwtProvider } from '../providers/JwtProvider';
import { JwtPayload } from 'jsonwebtoken'; // Định nghĩa kiểu cho token đã giải mã

// Mở rộng kiểu Request để thêm jwtDecoded
interface AuthenticatedRequest extends Request {
    jwtDecoded?: any;
}

export const isAuthorized = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const accessTokenFromCookie: string | undefined = req.cookies?.accessToken;

        if (!accessTokenFromCookie) {
            res.status(401).json({ message: 'Unauthorized (token not found)' });
            return;
        }

        const secretKey = process.env.ACCESS_TOKEN_SECRET_SIGNATURE;
        if (!secretKey) {
            throw new Error('Thiếu ACCESS_TOKEN_SECRET_SIGNATURE trong biến môi trường!');
        }

        // Xác thực token
        const accessTokenDecoded = await JwtProvider.verifyToken(accessTokenFromCookie, secretKey);

        // Gán vào request để tầng sau có thể sử dụng
        req.jwtDecoded = accessTokenDecoded;

        next();
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('jwt expired')) {
                res.status(410).json({ message: 'Need to refresh token' });
                return;
            }
            res.status(401).json({ message: 'Unauthorized! Token is invalid!' });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};
