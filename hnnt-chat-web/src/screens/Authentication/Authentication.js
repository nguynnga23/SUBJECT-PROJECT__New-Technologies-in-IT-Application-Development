import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdPhonePortrait } from 'react-icons/io';
import { FaBars, FaLock, FaS } from 'react-icons/fa6';
import { TbReload } from 'react-icons/tb';
import { IoMail } from 'react-icons/io5';
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md';

import '../../index.css';

import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/authSlice';
import { login, loginQR, register, sendOTPEmail, verifyOTP } from './api';

import QRLogin from '../../components/QR/QRLogin';
import { getUserById, getUserByNumberAndEmail } from '../Profile/api';

function Authentication() {
    const [number, setNumber] = useState('');
    const [password, setPassword] = useState('');
    const [loginBy, setLoginBy] = useState('password'); // password, QR, register, sendOTP, sendRegisterInfo
    const [menuOpen, setMenuOpen] = useState(false);
    const [resUser, setResUser] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [startQR, setStartQR] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const [numberRegister, setNumberRegister] = useState('');
    const [nameRegister, setNameRegister] = useState('');
    const [passwordRegister, setPasswordRegister] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailRegister, setEmailRegister] = useState('');
    const [otp, setOTP] = useState('');

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

    const handleRegister = async () => {
        if (!nameRegister || !passwordRegister || !confirmPassword) {
            alert('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{6,}$/;
        if (!passwordRegex.test(passwordRegister)) {
            alert('Mật khẩu mới phải có ít nhất 6 ký tự, gồm chữ, số và ký tự đặc biệt.');
            return;
        }

        if (passwordRegister !== confirmPassword) {
            alert('Mật khẩu không khớp!');
            return;
        }

        try {
            const data = await register(numberRegister, passwordRegister, emailRegister, nameRegister);
            if (data) {
                setLoginBy('password');
            } else {
                alert('Đăng ký không thành công!');
            }
        } catch (err) {
            alert('Lỗi server!');
        }
    };

    const handleSendOTP = async () => {
        if (!emailRegister) {
            alert('Vui lòng nhập email');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegister || !emailRegex.test(emailRegister)) {
            alert('Email không hợp lệ!');
            return false;
        }

        try {
            await sendOTPEmail(emailRegister);
            return true;
            // setLoginBy('sendOTP');
        } catch (error) {
            alert('Lỗi khi gửi mã OTP!');
            return false;
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp) {
            alert('Vui lòng nhập mã OTP');
            return;
        }

        try {
            const data = await verifyOTP(emailRegister, otp);
            if (data.success) {
                setLoginBy('sendRegisterInfo');
            } else {
                alert('Mã OTP không hợp lệ!');
            }
        } catch (error) {
            alert('Lỗi khi xác thực mã OTP!');
        }
    };

    const handleConformNumberAndEmail = async () => {
        if (!numberRegister || !emailRegister) {
            alert('Vui lòng nhập số điện thoại và email');
            return;
        }

        const phoneRegex = /^(03|05|07|08|09|01|02)\d{8}$/; // Chỉ chấp nhận số hợp lệ ở VN
        if (!phoneRegex.test(numberRegister) || /^(\d)\1{9}$/.test(numberRegister)) {
            alert('Số điện thoại không hợp lệ!');
            return;
        }

        // Kiểm tra tính hợp lệ của email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegister || !emailRegex.test(emailRegister)) {
            alert('Email không hợp lệ!');
            return;
        }

        const data = await getUserByNumberAndEmail(numberRegister, emailRegister);

        if (data?.exists) {
            setIsLoading(true);
            const sendsuccess = await handleSendOTP();
            if (sendsuccess) {
                setIsLoading(false);
                setLoginBy('sendOTP');
            } else {
                setIsLoading(false);
                alert('Email của bạn không đúng!');
            }
        } else {
            // setLoginBy('register');
        }
    };

    const handleSendOTPAgain = async () => {
        try {
            await sendOTPEmail(emailRegister);
        } catch (error) {
            alert('Lỗi khi gửi mã OTP!');
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
                <p className="text-center text-gray-600 mt-2">
                    {loginBy !== 'register' ? 'Đăng nhập tài khoản HNNT' : 'Đăng ký tài khoản HNNT'}
                </p>
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
                                className="text-center text-[14px] text-blue-500 mt-2 cursor-pointer hover:underline pt-6 px-6"
                                onClick={() => {
                                    setLoginBy('QR');
                                    setStartQR(true);
                                }}
                            >
                                Đăng nhập qua mã QR
                            </p>

                            <div className="flex justify-center items-center">
                                <p className="text-center text-[14px] ">Chưa có tài khoản? </p>
                                <p
                                    className="text-center text-[14px] text-blue-500  cursor-pointer hover:underline"
                                    onClick={() => {
                                        setLoginBy('register');
                                    }}
                                >
                                    Đăng ký
                                </p>
                            </div>
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
                {loginBy === 'register' && (
                    <div className="flex items-center justify-center w-[450px] shadow-lg bg-white rounded-lg">
                        <div className="w-full max-w-sm p-3 rounded-2xl ">
                            <h2 className="text-lg font-semibold text-center pb-6 border-b">Đăng ký tài khoản</h2>

                            <div className="mt-4 flex items-center  border-b ">
                                <IoMdPhonePortrait size={15} />
                                <div className="flex items-center p-3 mt-1">
                                    <span className="text-gray-600">+84</span>
                                    <input
                                        type="text"
                                        placeholder="Số điện thoại"
                                        className="w-full  outline-none ml-2"
                                        value={numberRegister}
                                        onChange={(e) => {
                                            let value = e.target.value.replace(/\D/g, ''); // Loại bỏ tất cả ký tự không phải số
                                            if (value.length > 10) value = value.slice(0, 10);
                                            setNumberRegister(value);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex mt-4 items-center  border-b ">
                                <IoMail size={15} />
                                <input
                                    type="email"
                                    placeholder="Email..."
                                    className="w-full p-3 mt-1 outline-none"
                                    value={emailRegister}
                                    onChange={(e) => setEmailRegister(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                className={`w-full flex items-center justify-center text-white py-2 rounded-lg mt-4 ${
                                    numberRegister && emailRegister
                                        ? 'bg-blue-500 hover:bg-blue-500'
                                        : 'bg-blue-100 cursor-not-allowed'
                                }`}
                                onClick={handleConformNumberAndEmail}
                                disabled={!numberRegister || !emailRegister}
                            >
                                {isLoading && <TbReload size={20} className={isLoading ? 'rotate' : ''} />}
                                {!isLoading && <p>Đăng ký tài khoản</p>}
                            </button>

                            <div className="flex justify-center items-center mt-4">
                                <p className="text-center text-[14px] ">Bạn đã có tài khoản? </p>
                                <p
                                    className="text-center text-[14px] text-blue-500  cursor-pointer hover:underline"
                                    onClick={() => {
                                        setLoginBy('password');
                                    }}
                                >
                                    Đăng nhập
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                {loginBy === 'sendOTP' && (
                    <div className="flex items-center justify-center w-[450px] shadow-lg bg-white rounded-lg">
                        <div className="w-full max-w-sm p-3 rounded-2xl ">
                            <div className="mt-4 flex items-center  border-b ">
                                <IoMdPhonePortrait size={15} />
                                <div className="flex items-center p-3 mt-1">
                                    <input
                                        type="text"
                                        maxlength="6"
                                        placeholder="OTP"
                                        className="w-full  outline-none ml-2"
                                        value={otp}
                                        onChange={(e) => {
                                            let value = e.target.value.replace(/\D/g, ''); // Loại bỏ tất cả ký tự không phải số
                                            setOTP(value);
                                        }}
                                    />
                                </div>
                            </div>

                            <button
                                className={`w-full text-white py-2 rounded-lg mt-4 ${
                                    numberRegister && emailRegister
                                        ? 'bg-blue-500 hover:bg-blue-500'
                                        : 'bg-blue-100 cursor-not-allowed'
                                }`}
                                onClick={handleVerifyOTP}
                                disabled={!numberRegister || !emailRegister}
                            >
                                Xác nhận mã
                            </button>

                            <div className="flex justify-center items-center mt-4">
                                <p
                                    className="text-center text-[14px] text-blue-500  cursor-pointer hover:underline"
                                    onClick={() => {
                                        handleSendOTPAgain();
                                    }}
                                >
                                    Gửi lại mã OTP
                                </p>
                            </div>

                            <div className="flex justify-center items-center mt-4">
                                <p
                                    className="text-center text-[14px] text-blue-500  cursor-pointer hover:underline"
                                    onClick={() => {
                                        setLoginBy('register');
                                    }}
                                >
                                    Quay lại
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {loginBy === 'sendRegisterInfo' && (
                    <div className="flex items-center justify-center w-[450px] shadow-lg bg-white rounded-lg">
                        <div className="w-full max-w-sm p-3 rounded-2xl ">
                            <h2 className="text-lg font-semibold text-center pb-6 border-b">
                                Nhập thông tin tài khoản
                            </h2>

                            <div className="mt-4 flex items-center  border-b ">
                                <MdOutlineDriveFileRenameOutline size={15} />
                                <div className="flex items-center p-3 mt-1">
                                    <input
                                        type="text"
                                        placeholder="Nhập tên của bạn"
                                        className="w-full  outline-none ml-2"
                                        value={nameRegister}
                                        required
                                        onChange={(e) => {
                                            setNameRegister(e.target.value);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex mt-4 items-center  border-b ">
                                <FaLock size={15} />
                                <input
                                    type="password"
                                    placeholder="Nhập mật khẩu..."
                                    className="w-full p-3 mt-1 outline-none"
                                    value={passwordRegister}
                                    onChange={(e) => setPasswordRegister(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex mt-4 items-center  border-b ">
                                <FaLock size={15} />
                                <input
                                    type="password"
                                    placeholder="Nhập lại mật khẩu..."
                                    className="w-full p-3 mt-1 outline-none"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                className={`w-full text-white py-2 rounded-lg mt-4 ${
                                    nameRegister && passwordRegister && confirmPassword
                                        ? 'bg-blue-500 hover:bg-blue-500'
                                        : 'bg-blue-100 cursor-not-allowed'
                                }`}
                                onClick={handleRegister}
                                disabled={!nameRegister || !passwordRegister || !confirmPassword}
                            >
                                Đăng ký tài khoản
                            </button>

                            <div className="flex justify-center items-center mt-4">
                                <p
                                    className="text-center text-[14px] text-blue-500  cursor-pointer hover:underline"
                                    onClick={() => {
                                        setLoginBy('register');
                                    }}
                                >
                                    Quay lại
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Authentication;
