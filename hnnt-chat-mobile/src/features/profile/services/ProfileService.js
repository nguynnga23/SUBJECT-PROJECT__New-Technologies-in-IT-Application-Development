import axios from 'axios';
import { localhost } from '../../../utils/localhosts';
import AsyncStorage from '@react-native-async-storage/async-storage';
const BASE_URL = `http://${localhost}/api/user`;

const ProfileService = {
    updateProfile: async (token, userUpdate) => {
        try {
            const response = await axios.put(
                `${BASE_URL}/update-user`,
                userUpdate, // truyền body ở đây
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
