import axios from 'axios';

const API_URL = 'http://192.168.170.60:5000/api/auth';
// const API_URL = 'http://192.168.101.11:5000/api/auth';

export const login = async (number, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { number, password });
        return response.data; // Trả về token và thông tin user
    } catch (error) {
        throw error.response?.data || error.message; // Trả về lỗi
    }
};