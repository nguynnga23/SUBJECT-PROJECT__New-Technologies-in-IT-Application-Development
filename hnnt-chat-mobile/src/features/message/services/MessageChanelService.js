import axios from 'axios';
import { localhost } from '../../../utils/localhosts'

const API_URL = `http://${localhost}/api/chats`;

export const fetchChats = async (token) => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong header
            },
        });
        return response.data; // Trả về danh sách chat
    } catch (error) {
        console.error('Error fetching chats:', error.response?.data || error.message);
        throw error;
    }
};