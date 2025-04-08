import { config } from 'dotenv';
import twilio from 'twilio';

config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendSMS = async (to: string, message: string): Promise<void> => {
    try {
        const response = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER, // Số Twilio của bạn
            to: to, // Số điện thoại nhận (phải có mã quốc gia, ví dụ: +84 cho Việt Nam)
        });
        console.log('SMS sent successfully:', response.sid);
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
};

// sendSMS('+84123456789', 'Mã xác nhận của bạn là 123456');
