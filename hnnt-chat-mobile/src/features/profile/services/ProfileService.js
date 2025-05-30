import axios from 'axios';
import { localhost } from '../../../utils/localhosts';
import AsyncStorage from '@react-native-async-storage/async-storage';
const BASE_URL = `${localhost}/api/user`;

const ProfileService = {
    updateProfile: async (token, { name, gender, birthDate }) => {
        try {
            const response = await axios.put(
                `${BASE_URL}/update-user`,
                { name, gender, birthDate }, // align with userController
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
    updateAvatar: async (token, imageUri) => {
        try {
            const formData = new FormData();
            formData.append('image', {
                uri: imageUri,
                name: 'avatar.jpg', // Provide a default name
                type: 'image/jpeg', // Specify the MIME type
            });

            const result = await axios.post(`${BASE_URL}/update-avatar`, formData, {
                // Changed PUT to POST
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return result.data;
        } catch (error) {
            console.error('Error updating avatar:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            throw error.response?.data || error.message;
        }
    },
    changePassword: async (token, { currentPassword, newPassword }) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/change-password-with-token`,
                { currentPassWord: currentPassword, newPassword },
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
    getUserById: async (token, userId) => {
        try {
            const response = await axios.get(`${BASE_URL}/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getUserByNumberAndEmail: async (token, { number, email }) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/check-number-email`,
                { number, email },
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
    getUserByNumberOrEmail: async (token, { number, email }) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/get-user-by-number-or-email`,
                { number, email },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};

export default ProfileService;
