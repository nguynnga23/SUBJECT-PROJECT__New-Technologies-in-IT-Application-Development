import axios from 'axios';
import { IP_4G, IP_WIFI } from '../../../../utils/localhosts'

const API_URL = `http://${IP_WIFI}:5000/api`;

export const fetchChat = async (chatId, token) => {
    try {
        const response = await axios.get(`${API_URL}/chats/${chatId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong header
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching chat info:', error.response?.data || error.message);
        throw error;
    }
};

export const getListFriendRequest = async (userId, token) => {
    try {
        const response = await axios.get(`${API_URL}/friends/request/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong header
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching friends:', error.response?.data || error.message);
        throw error;
    }
}

export const deleteMember = async (chatId, accId, token) => {
    try {
        const response = await axios.delete(`${API_URL}/groups/${chatId}/kick`, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong header
            },
            data: {
                accountId: accId, // Gửi accountId trong body
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error delete:', error.response?.data || error.message);
        throw error;
    }
};

export const addFriend = async (senderId, receiverId, token) => {
    try {
        const response = await axios.post(`${API_URL}/friends/request`,
            {
                senderId: senderId,
                receiverId: receiverId
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token trong header
                }
            });
        return response.data;
    } catch (error) {
        console.error('Error add friend:', error.response?.data || error.message);
        throw error;
    }
};

export const handleCancelAddFriend = (id, setFriendRequests) => {
    setFriendRequests((prevRequests) => {
        const updatedRequests = { ...prevRequests };
        delete updatedRequests[id]; // Xóa lời mời kết bạn
        return updatedRequests;
    });
};

export const changeRole = async (chatId, accId, token) => {
    try {
        const response = await axios.put(
            `${API_URL}/groups/role`,
            {
                chatId: chatId,
                accountId: accId,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Đảm bảo định dạng đúng
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error change role:', error.response?.data || error.message);
        throw error;
    }
};