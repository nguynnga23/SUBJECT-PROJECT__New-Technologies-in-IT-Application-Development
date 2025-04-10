import axios from 'axios';
import { localhost } from '../../../utils/localhosts';
import AsyncStorage from '@react-native-async-storage/async-storage';
const BASE_URL = `http://${localhost}/api/user`;

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
    updateAvatar: async (token, avatar) => {
        try {
            const response = await axios.put(
                `${BASE_URL}/update-avatar`,
                { image: avatar },
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
};

export default ProfileService;
