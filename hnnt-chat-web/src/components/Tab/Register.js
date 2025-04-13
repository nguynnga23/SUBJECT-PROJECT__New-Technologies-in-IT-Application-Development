import React, { useEffect, useRef, useState } from 'react';

const Register = ({ setOpenRegister, openRegister }) => {
    const [form, setForm] = useState({
        name: '',
        number: '',
        password: '',
        avatar: null,
        status: '',
        birthDate: '',
        location: '',
        gender: '',
        email: '',
    });

    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFileName(file ? file.name : '');
        // Bạn có thể lưu `file` vào form nếu dùng chung state
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
        // Gửi form lên backend tại đây
    };

    const handleChooseFile = () => {
        fileInputRef.current.click(); // kích hoạt input ẩn
    };

    const popupContainerRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupContainerRef.current && !popupContainerRef.current.contains(event.target)) {
                setOpenRegister(false);
            }
        }
        if (openRegister) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openRegister, setOpenRegister]);

    return (
        <div className="w-full h-full">
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                {/* <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8"> */}
                <div
                    className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
                    ref={popupContainerRef}
                >
                    <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">Đăng ký</h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                name="number"
                                value={form.number}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Họ tên</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Ngày sinh
                            </label>
                            <input
                                type="date"
                                name="birthDate"
                                value={form.birthDate}
                                onChange={handleChange}
                                className="mt-1 w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Giới tính
                            </label>
                            <select
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">-- Chọn giới tính --</option>
                                <option value="male">Nam</option>
                                <option value="female">Nữ</option>
                                <option value="other">Khác</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Địa chỉ
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                className="mt-1 w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Ảnh đại diện
                            </label>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleChooseFile}
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                                >
                                    Chọn ảnh
                                </button>
                                {fileName && (
                                    <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[150px]">
                                        {fileName}
                                    </span>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                            >
                                Đăng ký
                            </button>
                        </div>
                    </form>
                </div>
                {/* </div> */}
            </div>
        </div>
    );
};

export default Register;
