import axios from 'axios';

import { localhost } from '../../../utils/localhosts';

const API_URL = `${localhost}/api/auth`;

export const login = async (number, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { number, password });
        return response.data; // Trả về token và thông tin user
    } catch (error) {
        throw error.response?.data || error.message; // Trả về lỗi
    }
};

export const confirmQRLogin = async (token, userId) => {
    try {
        const response = await fetch(`${API_URL}/qr-login/confirm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
                userId,
            }),
        });

        const data = await response.json();
        console.log('QR login confirm response:', data);
        return data;
    } catch (error) {
        console.error('Error confirming QR login:', error);
        throw error;
    }
};

export const logout = async (token) => {
    try {
        const response = await axios.post(
            `${API_URL}/logout`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return response.data; // Trả về thông báo thành công
    } catch (error) {
        throw error.response?.data || error.message; // Trả về lỗi
    }
};
