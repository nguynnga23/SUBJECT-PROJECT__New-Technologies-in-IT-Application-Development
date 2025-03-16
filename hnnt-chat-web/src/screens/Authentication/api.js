const API_URL = 'http://localhost:4000/api/auth/login';

export const login = async (number, password) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number, password }),
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    return response.json();
};
