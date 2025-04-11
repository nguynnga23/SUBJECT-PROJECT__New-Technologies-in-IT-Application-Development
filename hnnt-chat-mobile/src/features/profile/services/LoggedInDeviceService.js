import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ensure AsyncStorage is imported
import { localhost } from '../../../utils/localhosts'; // Import localhost variable

const API_BASE_URL = `http://${localhost}/api/loggedin-devices`;

const getToken = async () => {
    return await AsyncStorage.getItem('token');
};

const LoggedInDeviceService = {
    getDevices: async () => {
        try {
            const token = await getToken();
            const response = await axios.get(`${API_BASE_URL}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch devices');
        }
    },

    addDevice: async (deviceData) => {
        try {
            const token = await getToken();
            const response = await axios.post(`${API_BASE_URL}`, deviceData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            throw new Error('Failed to add device');
        }
    },

    updateDevice: async (id, updatedData) => {
        try {
            const token = await getToken();
            const response = await axios.put(`${API_BASE_URL}/${id}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            throw new Error('Failed to update device');
        }
    },

    deleteDevice: async (id) => {
        try {
            const token = await getToken();
            await axios.delete(`${API_BASE_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            throw new Error('Failed to delete device');
        }
    },

    logoutOtherDevices: async () => {
        try {
            const token = await getToken();
            const response = await axios.post(
                `${API_BASE_URL}/logout-other`,
                {}, // No payload required as per the route
                { headers: { Authorization: `Bearer ${token}` } },
            );
            return response.data;
        } catch (error) {
            throw new Error('Failed to logout other devices');
        }
    },
};

export default LoggedInDeviceService;
