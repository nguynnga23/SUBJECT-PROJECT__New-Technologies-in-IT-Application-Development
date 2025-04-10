import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdPhonePortrait } from 'react-icons/io';
import { FaBars, FaLock } from 'react-icons/fa6';
import { TbReload } from 'react-icons/tb';

import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/authSlice';
import { login, loginQR } from './api';

import QRLogin from '../../components/QR/QRLogin';
import { getUserById } from '../Profile/api';

function Authentication() {
    const [number, setNumber] = useState('');
    const [password, setPassword] = useState('');
    const [loginBy, setLoginBy] = useState('password');
    const [menuOpen, setMenuOpen] = useState(false);
    const [resUser, setResUser] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [startQR, setStartQR] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    console.log('statusMessage', statusMessage.trim() === '');

    const handleLoginQR = async () => {
        try {
            const data = await loginQR(statusMessage);
            localStorage.setItem('token', data.token);
            dispatch(setUser({ userActive: data.user, token: data.token }));
            navigate('/home');
        } catch (err) {
            alert('Lỗi server!');
        }
    };

    const handleLogin = async () => {
        try {
            const data = await login(number, password);
            localStorage.setItem('token', data.token);
            dispatch(setUser({ userActive: data.user, token: data.token }));
            navigate('/home');
        } catch (err) {
            alert('Lỗi server!');
        }
    };

    useEffect(() => {
        const getUser = async () => {
            try {
                const data = await getUserById(statusMessage);
                if (data) {
                    dispatch(setUser({ userActive: data, token: null }));
                    setResUser(data);
                } else {
                    console.warn('Không tìm thấy user');
                }
            } catch (error) {
                console.error('Lỗi khi lấy user:', error);
            }
        };

        if (statusMessage) {
            getUser();
        }
    }, [statusMessage]);

    return (
        <div className="min-h-screen bg-blue-50">
            <div className="p-9">
                <h1 className="text-3xl font-bold text-center text-blue-600">HNNT</h1>
                <p className="text-center text-gray-600 mt-2">Đăng nhập tài khoản HNNT</p>
            </div>
            <div className="flex  items-center justify-center">
                {loginBy === 'password' && (
                    <div className="flex items-center justify-center w-[450px] shadow-lg bg-white rounded-lg">
                        <div className="w-full max-w-sm p-3 rounded-2xl ">
                            <h2 className="text-lg font-semibold text-center pb-6 border-b">Đăng nhập với mật khẩu</h2>

                            <div className="mt-4 flex items-center  border-b ">
                                <IoMdPhonePortrait size={15} />
                                <div className="flex items-center p-3 mt-1">
                                    <span className="text-gray-600">+84</span>
                                    <input
                                        type="text"
                                        placeholder="Số điện thoại"
                                        className="w-full  outline-none ml-2"
                                        value={number}
                                        onChange={(e) => {
                                            let value = e.target.value.replace(/\D/g, ''); // Loại bỏ tất cả ký tự không phải số
                                            if (value.length > 10) value = value.slice(0, 10);
                                            setNumber(value);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex mt-4 items-center  border-b ">
                                <FaLock size={15} />
                                <input
                                    type="password"
                                    placeholder="Mật khẩu"
                                    className="w-full p-3 mt-1 outline-none"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button
                                className={`w-full text-white py-2 rounded-lg mt-4 ${
                                    number && password
                                        ? 'bg-blue-500 hover:bg-blue-500'
                                        : 'bg-blue-100 cursor-not-allowed'
                                }`}
                                onClick={handleLogin}
                                disabled={!number || !password}
                            >
                                Đăng nhập với mật khẩu
                            </button>

                            <p className="text-center text-[14px] mt-2 cursor-pointer hover:underline">Quên mật khẩu</p>

                            <p
                                className="text-center text-[14px] text-blue-500 mt-2 cursor-pointer hover:underline p-6"
                                onClick={() => {
                                    setLoginBy('QR');
                                    setStartQR(true);
                                }}
                            >
                                Đăng nhập qua mã QR
                            </p>
                        </div>
                    </div>
                )}
                {loginBy === 'QR' && (
                    <div className="flex items-center justify-center w-[450px] shadow-lg bg-white rounded-lg">
                        <div className="w-full max-w-sm p-3 rounded-2xl relative">
                            {/* Tiêu đề */}
                            <h2 className="text-lg font-semibold text-center">Đăng nhập qua mã QR</h2>

                            {/* Nút menu */}
                            <button
                                className="absolute border top-2 right-0 p-2 text-gray-600 hover:bg-gray-200 rounded-lg"
                                onClick={() => setMenuOpen(!menuOpen)}
                            >
                                <FaBars size={18} />
                            </button>
                            {/* Dropdown menu */}
                            {menuOpen && (
                                <div className="absolute top-12 right-4 bg-white shadow-md rounded-md p-2">
                                    <button
                                        className="text-sm text-gray-700 px-4 py-2 hover:bg-gray-100 w-full"
                                        onClick={() => {
                                            setLoginBy('password');
                                            setMenuOpen(!menuOpen);
                                        }}
                                    >
                                        Đăng nhập với mật khẩu
                                    </button>
                                </div>
                            )}

                            {/* QR Code */}
                            <div className="flex m-6 justify-center">
                                <div className="p-4 border rounded-lg w-full max-w-sm flex flex-col items-center">
                                    {/* QR Code */}
                                    {statusMessage.trim() === 'waiting for scan code' ||
                                    statusMessage.trim() === 'QR expired' ||
                                    statusMessage.trim() === '' ||
                                    resUser?.avatar.trim() === '' ? (
                                        <div className="relative w-[200px] h-[200px]">
                                            {/* QR Component */}
                                            <QRLogin
                                                shouldStart={startQR}
                                                onStatusChange={(msg) => setStatusMessage(msg)}
                                                setShouldStart={setStartQR}
                                            />

                                            {/* Overlay phủ mờ */}
                                            {statusMessage === 'QR expired' && (
                                                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center rounded">
                                                    <p className="text-white text-sm">QR hết hạn...</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <img alt="avatar" src={resUser?.avatar} />
                                    )}

                                    {statusMessage !== 'waiting for scan code' && statusMessage !== 'QR expired' ? (
                                        <button
                                            className="px-6 py-3 bg-blue-500 text-white text-base font-medium rounded-lg mt-4 w-[220px] hover:bg-blue-600 transition duration-200"
                                            onClick={handleLoginQR}
                                        >
                                            {`Đăng nhập với ${resUser?.name}`}
                                        </button>
                                    ) : statusMessage === 'QR expired' ? (
                                        <button
                                            className=" flex justify-center items-center px-6 py-3 bg-blue-500 text-white text-base font-medium rounded-lg mt-4 w-[220px] hover:bg-blue-600 transition duration-200"
                                            onClick={() => {
                                                setStartQR(true);
                                            }}
                                        >
                                            <TbReload size={20} className="inline-block mr-2" />
                                            <p>Làm mới lại QR</p>
                                        </button>
                                    ) : null}

                                    {/* Ghi chú */}
                                    <p className="text-center text-blue-500 mt-3 text-[12px]">Chỉ dùng để đăng nhập</p>
                                    <p className="text-center text-gray-500 text-[12px]">HNNT trên máy tính</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Authentication;
