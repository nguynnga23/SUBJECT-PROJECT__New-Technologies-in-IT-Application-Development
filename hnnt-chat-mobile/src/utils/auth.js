export const getUserIdFromToken = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Giải mã phần payload của token
        return payload.id; // Trả về userId
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};
