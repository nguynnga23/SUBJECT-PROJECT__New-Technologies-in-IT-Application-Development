import axios from 'axios';

import { localhost } from '../../../utils/localhosts';

const API_URL = `http://${localhost}/api/auth`;

export const login = async (number, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { number, password });
        return response.data; // Trả về token và thông tin user
    } catch (error) {
        throw error.response?.data || error.message; // Trả về lỗi
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
