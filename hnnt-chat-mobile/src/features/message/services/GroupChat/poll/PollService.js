import axios from 'axios';

import { localhost } from '../../../../../utils/localhosts';

const API_BASE_URL = `http://${localhost}/api/polls`;
// Create a new poll
export const createPoll = async (pollData) => {
    try {
        const response = await axios.post(API_BASE_URL, pollData);
        return response.data;
    } catch (error) {
        console.error('Failed to create poll:', error);
        throw error;
    }
};

// Get polls by chat ID
export const getPollsByChat = async (chatId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${chatId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch polls:', error);
        throw error;
    }
};

// Get a poll by ID
export const getPollById = async (pollId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/pollChat/${pollId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch poll by ID:', error);
        throw error;
    }
};

// Vote on a poll option
export const votePollOption = async (voteData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/vote`, voteData); // Ensure voteData includes voterId
        return response.data;
    } catch (error) {
        console.error('Failed to vote on poll option:', error);
        throw error;
    }
};

// Delete a poll
export const deletePoll = async (pollId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${pollId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to delete poll:', error);
        throw error;
    }
};
