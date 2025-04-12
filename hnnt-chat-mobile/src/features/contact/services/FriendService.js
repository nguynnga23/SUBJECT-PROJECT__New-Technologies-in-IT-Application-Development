import axios from 'axios';
import { localhost } from '../../../utils/localhosts';
import AsyncStorage from '@react-native-async-storage/async-storage';
const BASE_URL = `http://${localhost}/api/friends`; // Ensure the correct port is used

const friendService = {
    // Lấy danh sách bạn bè
    getFriends: async (token) => {
        try {
            const response = await axios.get(`${BASE_URL}/list`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Lấy danh sách lời mời kết bạn
    getFriendRequests: async (token) => {
        try {
            const response = await axios.get(`${BASE_URL}/request`, {
                // Updated endpoint
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data; // Return the list of friend requests
        } catch (error) {
            console.error('Error fetching friend requests:', error.response || error.message); // Log full error
            throw error.response?.data || error.message;
        }
    },

    // Gửi lời mời kết bạn
    sendFriendRequest: async (receiverId, token) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/request`,
                { receiverId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                },
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Hủy lời mời kết bạn
    cancelFriendRequest: async (requestId, token) => {
        try {
            const response = await axios.delete(`${BASE_URL}/request/cancel/${requestId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Chấp nhận lời mời kết bạn
    acceptFriendRequest: async (requestId, token) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/request/accept/${requestId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                },
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Kiểm tra lời mời kết bạn
    checkFriendRequest: async (friendId, token) => {
        try {
            const response = await axios.get(`${BASE_URL}/request/check/${friendId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Xóa bạn bè
    deleteFriend: async (friendId, token) => {
        try {
            const response = await axios.delete(`${BASE_URL}/delete/${friendId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error unfriending:', error.response || error.message); // Log full error
            throw error.response?.data || error.message;
        }
    },

    // Kiểm tra quan hệ bạn bè
    checkFriend: async (friendId, token) => {
        try {
            const response = await axios.get(`${BASE_URL}/check-friend/${friendId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Lấy danh sách lời mời kết bạn đã gửi
    getSentFriendRequests: async (token) => {
        try {
            const response = await axios.get(`${BASE_URL}/request/sender`, {
                // Updated endpoint
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Hủy lời mời kết bạn đã gửi
    cancelSentFriendRequest: async (receiverId, token) => {
        try {
            const response = await axios.delete(`${BASE_URL}/request/cancel-by-sender/${receiverId}`, {
                // Updated endpoint
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Block người dùng
    blockUser: async (receiverId, token) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/user/block`,
                { receiverId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                },
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Lấy danh sách block
    getBlockedUsers: async (token) => {
        try {
            const response = await axios.get(`${BASE_URL}/user/block/list`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Hủy block người dùng
    cancelBlock: async (blockId, token) => {
        try {
            const response = await axios.delete(`${BASE_URL}/user/block/${blockId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};

export default friendService;
