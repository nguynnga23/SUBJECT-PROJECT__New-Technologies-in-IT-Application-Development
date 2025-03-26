export const login = async (number, password) => {
    const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number, password }),
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token); // Lưu token mới vào localStorage

    return data;
};

export const logout = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:4000/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
        throw new Error('Logout failed');
    }

    localStorage.removeItem('token');

    return response.json();
};
