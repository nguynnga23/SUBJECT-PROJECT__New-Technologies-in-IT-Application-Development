import axios from "axios";
import { localhost } from "../../../utils/localhosts";

const API_URL = `http://${localhost}/api`;

// POST http://localhost:4000/api/auth/forgot-password
// {
//     "number": "0384784472",
//     "email": "nhathuy39337343@gmail.com"
// }
export const forgotPassword = async (number, email) => {
    try {
        const response = await axios.post(`${API_URL}/auth/forgot-password`, { number, email });
        return response.data;
    } catch (error) {
        console.warn(error.response?.data || error.message);
    }
}

export const verifyOtp = async (email, otp) => {
    try {
        const response = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp });
        return response.data;
    } catch (error) {
        console.warn(error.response?.data || error.message);
    }
}

// POST http://localhost:4000/api/auth/change-password
// {
//     "number": "0384784472",
//     "newPassword": "1234"
// }
export const changePassword = async (number, newPassword) => {
    try {
        const response = await axios.post(`${API_URL}/auth/change-password`, { number, newPassword });
        return response.data;
    } catch (error) {
        console.warn(error.response?.data || error.message);
    }
}