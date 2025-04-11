import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileService from '../services/ProfileService';

export const fetchUserData = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Token not found');

        const userJson = await AsyncStorage.getItem('user');
        if (!userJson) throw new Error('User not found in storage');

        const user = JSON.parse(userJson);
        if (!user?.id) throw new Error('User ID not found');

        const userData = await ProfileService.getUserById(token, user.id);
        return userData;
    } catch (error) {
        console.error('Error fetching user from API:', error);
        throw error;
    }
};
