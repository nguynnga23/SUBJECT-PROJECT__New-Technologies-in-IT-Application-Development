export const updateUser = async (name, gender, birthDate) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');

        const response = await fetch(`http://localhost:4000/api/user/update-user`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, gender, birthDate }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null); // Bắt lỗi khi API không trả về JSON
            console.error('Lỗi từ server:', errorData || response.statusText);
            throw new Error(errorData?.message || `Lỗi ${response.status}: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Lỗi khi update:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const updateAvatar = async (image) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token is required');
        const response = await fetch(`http://localhost:4000/api/user/update-avatar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ image }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null); // Bắt lỗi khi API không trả về JSON
            console.error('Lỗi từ server:', errorData || response.statusText);
            throw new Error(errorData?.message || `Lỗi ${response.status}: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Lỗi khi upload ảnh:', error);
        throw error;
    }
};
