import axios from 'axios';
import { IP_4G, IP_WIFI } from '../../../utils/localhosts'

const API_URL = `http://${IP_WIFI}:5000/api/auth`;

export const login = async (number, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { number, password });
        return response.data; // Trả về token và thông tin user
    } catch (error) {
        throw error.response?.data || error.message; // Trả về lỗi
    }
};