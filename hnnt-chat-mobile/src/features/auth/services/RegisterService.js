import axios from "axios";
import { localhost } from "../../../utils/localhosts";

const API_URL = `${localhost}/api`;

//http://localhost:4000/api/auth/register
// {
//     "email": "nhiethiz@gmail.com",
//     "number": "0834258511",
//     "password": "12345678"
// }
export const register = async (email, number, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, { email, number, password });
        return response.data;
    } catch (error) {
        console.warn(error.response?.data || error.message);
    }
}

//http://localhost:4000/api/auth/send-otp
// {
//     "email": "nguyenthientu413@gmail.com"
// }
export const sendOtp = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/auth/send-otp`, { email });
        return response.data;
    } catch (error) {
        console.warn(error.response?.data || error.message);
    }
}

//http://localhost:4000/api/auth/verify-otp
// {
//     "email": "nhathuy39337343@gmail.com",
//     "otp": "836721"
// }
export const verifyOtp = async (email, otp) => {
    try {
        const response = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp });
        return response.data;
    } catch (error) {
        console.warn(error.response?.data || error.message);
    }
}