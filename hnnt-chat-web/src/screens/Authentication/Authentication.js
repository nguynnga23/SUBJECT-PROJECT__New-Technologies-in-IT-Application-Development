import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Accounts from '../../sample_data/listAccount';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/authSlice';

function Authentication() {
    const [number, setNumber] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = () => {
        const user = Accounts.find((account) => account.number === number && account.password === password);
        if (user) {
            dispatch(setUser({ userActive: user, token: null }));
            navigate('/home');
        } else {
            alert('Sai số điện thoại hoặc mật khẩu!');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-100">
            <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-center text-blue-600">HNNT</h1>
                <p className="text-center text-gray-600 mt-2">Đăng nhập tài khoản HNNT</p>

                <h2 className="text-lg font-semibold text-center mt-6">Đăng nhập với mật khẩu</h2>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <div className="flex border rounded-lg p-2 mt-1">
                        <span className="text-gray-600">+84</span>
                        <input
                            type="text"
                            placeholder="Số điện thoại"
                            className="w-full outline-none ml-2"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        className="w-full border rounded-lg p-2 mt-1 outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 hover:bg-blue-600"
                    onClick={handleLogin}
                >
                    Đăng nhập với mật khẩu
                </button>

                <p className="text-center text-blue-500 mt-2 cursor-pointer hover:underline">Quên mật khẩu</p>

                <p className="text-center text-blue-500 mt-2 cursor-pointer hover:underline">Đăng nhập qua mã QR</p>
            </div>
        </div>
    );
}

export default Authentication;
