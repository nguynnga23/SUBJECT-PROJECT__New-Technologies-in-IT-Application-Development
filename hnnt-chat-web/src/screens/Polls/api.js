export const createPoll = async (chatId, creatorId, title, endsAt, options) => {
    try {
        const response = await fetch(`http://localhost:4000/api/polls`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chatId,
                creatorId,
                title,
                endsAt,
                options,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null); // Bắt lỗi khi API không trả về JSON
            console.error('Lỗi từ server:', errorData || response.statusText);
            throw new Error(errorData?.message || `Lỗi ${response.status}: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Lỗi khi tạo bình chọn:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const getPolls = async (chatId) => {
    try {
        const response = await fetch(`http://localhost:4000/api/polls/${chatId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null); // Bắt lỗi khi API không trả về JSON
            console.error('Lỗi từ server:', errorData || response.statusText);
            throw new Error(errorData?.message || `Lỗi ${response.status}: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Lỗi khi lấy danh sách bình chọn:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const votePollOption = async (pollOptionId, voterId) => {
    try {
        const response = await fetch(`http://localhost:4000/api/polls/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pollOptionId,
                voterId,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null); // Bắt lỗi khi API không trả về JSON
            console.error('Lỗi từ server:', errorData || response.statusText);
            throw new Error(errorData?.message || `Lỗi ${response.status}: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Lỗi khi bình chọn:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const getPollResults = async (pollId) => {
    if (!pollId) {
        throw new Error('pollId không hợp lệ');
    }

    try {
        const response = await fetch(`http://localhost:4000/api/polls/results/${pollId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null); // Bắt lỗi khi API không trả về JSON
            console.error('Lỗi từ server:', errorData || response.statusText);
            throw new Error(errorData?.message || `Lỗi ${response.status}: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Lỗi khi lấy kết quả bình chọn:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

export const getPollById = async (pollId) => {
    if (!pollId) {
        throw new Error('pollId không hợp lệ');
    }

    try {
        const response = await fetch(`http://localhost:4000/api/polls/pollChat/${pollId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null); // Bắt lỗi khi API không trả về JSON
            console.error('Lỗi từ server:', errorData || response.statusText);
            throw new Error(errorData?.message || `Lỗi ${response.status}: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Lỗi khi lấy bình chọn:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};

// update votePoll
export const updateVotePoll = async (pollId, optionIds, voterId) => {
    try {
        const response = await fetch(`http://localhost:4000/api/polls/update-vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                optionIds,
                voterId,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null); // Bắt lỗi khi API không trả về JSON
            console.error('Lỗi từ server:', errorData || response.statusText);
            throw new Error(errorData?.message || `Lỗi ${response.status}: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Lỗi khi cập nhật bình chọn:', error);
        throw error; // Để hàm gọi nó có thể xử lý
    }
};
