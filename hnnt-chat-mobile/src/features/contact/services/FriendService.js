// src/services/friendService.js
const BASE_URL = 'http://api.example.com';

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch friends');
    }
    return response.json();
};

export const getFriendList = async (userId) => {
    try {
        const response = await fetch(`${BASE_URL}/users/${userId}/friends`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching friend list:', error);
        throw error;
    }
};
