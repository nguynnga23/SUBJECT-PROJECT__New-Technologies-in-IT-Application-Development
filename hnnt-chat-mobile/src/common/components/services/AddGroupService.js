import axios from 'axios';
import { localhost } from '../../../utils/localhosts';

const API_URL = `http://${localhost}/api`;

// Hàm tạo nhóm
export const createGroup = async (name, avatar, chatParticipants, token) => {
    try {
        const response = await axios.post(
            `${API_URL}/groups/create`,
            {
                name,
                avatar,
                chatParticipant: chatParticipants, // Danh sách thành viên
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token trong header
                },
            },
        );
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.warn('Error creating group:', error.response?.data || error.message);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

export const getListFriends = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/friends/list`, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong header
            },
        });
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error('Error fetching friends:', error.response?.data || error.message);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};
