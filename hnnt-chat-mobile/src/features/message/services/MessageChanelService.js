import axios from 'axios';

const API_URL = 'http://192.168.101.11:5000/api/chats';

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