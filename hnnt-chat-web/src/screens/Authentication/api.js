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

export const register = async (number, password, email, name) => {
    const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number, password, email, name }),
    });

    if (!response.ok) {
        throw new Error('Register failed');
    }

    return response.json();
};

export const sendOTPEmail = async (email) => {
    const response = await fetch('http://localhost:4000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        throw new Error('Send OTP failed');
    }

    return response.json();
};

export const verifyOTP = async (email, otp) => {
    const response = await fetch('http://localhost:4000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
        throw new Error('Verify OTP failed');
    }

    return response.json();
};

export const changePasswordWithToken = async (currentPassWord, newPassword) => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:4000/api/auth/change-password-with-token', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassWord, newPassword }),
    });
    if (!response.ok) {
        throw new Error('Change password failed');
    }

    return response.json();
};

export const loginQR = async (userId) => {
    const response = await fetch('http://localhost:4000/api/auth/qr-login/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token); // Lưu token mới vào localStorage

    return data;
};

export const forgotPassword = async (number, email) => {
    const response = await fetch('http://localhost:4000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number, email }),
    });

    if (!response.ok) {
        throw new Error('Forgot password failed');
    }

    return response.json();
};

export const changePassword = async (number, newPassword) => {
    const response = await fetch('http://localhost:4000/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number, newPassword }),
    });
    if (!response.ok) {
        throw new Error('Change password failed');
    }

    return response.json();
};

export const addDevice = async (deviceId, deviceName, platform, accessToken, ipAddress) => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:4000/api/loggedin-devices', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, deviceName, platform, accessToken, ipAddress }),
    });
    if (!response.ok) {
        throw new Error('Save device info failed');
    }

    return response.json();
};
