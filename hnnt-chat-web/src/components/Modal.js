import { useState } from 'react';
import CoverPhoto from '../public/cover_photo_sample.jpg';
import Avatar from '../public/avatar_sample.jpg';

import { CiCamera } from 'react-icons/ci';
import { LuPencilLine } from 'react-icons/lu';
import { IoIosArrowBack } from 'react-icons/io';
import { MdOutlineInsertPhoto } from 'react-icons/md';

import { motion } from 'framer-motion';

function Modal({ isOpen, onClose }) {
    const [isType, setIsType] = useState('profile');
    const [isName, setIsName] = useState('Nguyễn Thiên Tứ');
    const [gender, setGender] = useState('male');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-md shadow-lg py-2 w-full max-w-sm h-[80vh] flex flex-col relative overflow-hidden">
                <div className="flex justify-between px-4 items-center mb-4">
                    {isType === 'avatar' ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsType('profile')}
                                className="w-8 h-8 flex items-center justify-center text-black hover:text-gray-700 hover:bg-gray-200 rounded-full text-xl"
                            >
                                <IoIosArrowBack />
                            </button>
                            <p className="text-md font-semibold">Cập nhật ảnh đại diện</p>
                        </div>
                    ) : isType === 'edit' ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsType('profile')}
                                className="w-8 h-8 flex items-center justify-center text-black hover:text-gray-700 hover:bg-gray-200 rounded-full text-xl"
                            >
                                <IoIosArrowBack />
                            </button>
                            <p className="text-md font-semibold">Cập nhật thông tin cá nhân</p>
                        </div>
                    ) : (
                        <p className="text-md font-semibold">Thông tin tài khoản</p>
                    )}
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center text-black hover:text-gray-700 hover:bg-gray-200 rounded-full text-xl"
                    >
                        ✕
                    </button>
                </div>

                {isType === 'avatar' ? (
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }} // Bắt đầu ngoài màn hình bên phải
                        animate={{ x: '0%', opacity: 1 }} // Trượt vào giữa màn hình
                        exit={{ x: '100%', opacity: 0 }} // Khi đóng, trượt ngược ra phải
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                    >
                        <div className="border-t pt-2 flex justify-center">
                            <button
                                onClick={onClose}
                                className="w-11/12 text-blue-800 bg-blue-200 hover:bg-blue-300 rounded-md flex items-center justify-center gap-2 p-2 cursor-pointer"
                            >
                                <MdOutlineInsertPhoto className="cursor-pointer" />
                                <p className="font-semibold">Tải lên từ máy tính</p>
                            </button>
                        </div>

                        <p className="font-semibold ml-4 mt-6">Ảnh đại diện của tôi</p>

                        <div className="grid grid-cols-4 gap-4 w-full px-6 mt-3">
                            <img
                                src={Avatar}
                                alt="avatar"
                                className="w-16 h-16 object-cover rounded-full border-1 border-black cursor-pointer"
                            />
                            <img
                                src={Avatar}
                                alt="avatar"
                                className="w-16 h-16 object-cover rounded-full border-1 border-black cursor-pointer"
                            />
                            <img
                                src={Avatar}
                                alt="avatar"
                                className="w-16 h-16 object-cover rounded-full border-1 border-black cursor-pointer"
                            />
                            <img
                                src={Avatar}
                                alt="avatar"
                                className="w-16 h-16 object-cover rounded-full border-1 border-black cursor-pointer"
                            />
                            <img
                                src={Avatar}
                                alt="avatar"
                                className="w-16 h-16 object-cover rounded-full border-1 border-black cursor-pointer"
                            />
                        </div>
                    </motion.div>
                ) : isType === 'edit' ? (
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }} // Bắt đầu ngoài màn hình bên phải
                        animate={{ x: '0%', opacity: 1 }} // Trượt vào giữa màn hình
                        exit={{ x: '100%', opacity: 0 }} // Khi đóng, trượt ngược ra phải
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="flex flex-col h-full"
                    >
                        <div className="border-t pt-2 mx-4">
                            <p className="text-sm">Tên hiển thị</p>
                            <input
                                type="text"
                                id="default-search"
                                class="w-full border-2 border-gray-200 p-2 rounded-md mt-1 focus:ring-blue-500 focus:border-blue-500"
                                required
                                value={isName}
                                onChange={(e) => setIsName(e.target.value)}
                            />

                            <p className="text-base font-semibold mt-6">Thông tin cá nhân</p>
                            <div className="flex space-x-4 mt-4 ">
                                {/* Radio Nam */}
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={gender === 'male'}
                                        onChange={() => setGender('male')}
                                        className="w-4 h-4 text-blue-600 border-blue-500 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-700">Nam</span>
                                </label>

                                {/* Radio Nữ */}
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={gender === 'female'}
                                        onChange={() => setGender('female')}
                                        className="w-4 h-4 text-blue-600 border-blue-500 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-700">Nữ</span>
                                </label>
                            </div>

                            {/* ngày sinh */}
                            <p className="text-sm mt-4 mb-2">Ngày sinh</p>
                            <div className="flex gap-2 w-full">
                                {/* Ngày */}
                                <select
                                    style={{ minWidth: '30%' }}
                                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                >
                                    {Array.from({ length: 31 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {i + 1}
                                        </option>
                                    ))}
                                </select>

                                {/* Tháng */}
                                <select
                                    style={{ minWidth: '30%' }}
                                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                >
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {i + 1}
                                        </option>
                                    ))}
                                </select>

                                {/* Năm */}
                                <select
                                    style={{ minWidth: '35%' }}
                                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                >
                                    {Array.from({ length: 100 }, (_, i) => {
                                        const year = new Date().getFullYear() - i;
                                        return (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        {/* button cập nhật */}
                        <div className="border-t pt-2 flex justify-end mt-auto">
                            <button
                                onClick={() => setIsType('profile')}
                                className="bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center gap-2 p-2 cursor-pointer mr-2"
                            >
                                <p className="font-semibold">Hủy</p>
                            </button>

                            <button
                                onClick={onClose}
                                className="bg-blue-600 hover:bg-blue-800 rounded-md flex items-center justify-center gap-2 p-2 cursor-pointer mr-3"
                            >
                                <p className="font-semibold text-white">Cập nhật</p>
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <>
                        <div className="flex-1 overflow-auto relative">
                            <img src={CoverPhoto} alt="Ảnh phụ" className="w-full h-[200px] cursor-pointer" />

                            <div className="absolute top-44 left-0 w-[80px] h-[80px] rounded-full shadow-lg overflow-hidden ml-6  border-4 border-gray-300 cursor-pointer">
                                <img src={Avatar} alt="Ảnh phụ" className="w-full h-full object-cover" />
                            </div>

                            <div
                                onClick={() => setIsType('avatar')}
                                className="absolute top-56 left-20 w-8 h-8 bg-gray-200 border border-gray-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300"
                            >
                                <CiCamera className="w-4 h-4 text-sm" />
                            </div>

                            <div
                                className="absolute top-52 left-32 flex items-center justify-center"
                                onClick={() => setIsType('edit')}
                            >
                                <p className="font-semibold mr-3">Nguyễn Thiên Tứ</p>
                                <LuPencilLine className="cursor-pointer" />
                            </div>

                            <div className="absolute w-full h-1 bg-gray-200 top-60 mt-6"></div>

                            <div className="absolute px-6 top-64 mt-3">
                                <p className="font-semibold">Thông tin cá nhân</p>

                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-sm">
                                    <p className="text-gray-500">Giới tính</p>
                                    <p>Nam</p>

                                    <p className="text-gray-500">Ngày sinh</p>
                                    <p>02 tháng 01, 2003</p>

                                    <p className="text-gray-500">Điện thoại</p>
                                    <p>+84 935 019 843</p>
                                </div>

                                <p className="text-gray-500 mt-3 text-xs">
                                    Chỉ bạn bè có thể lưu số của bạn trong danh bạ máy xem được số này
                                </p>
                            </div>
                        </div>

                        <div className="border-t pt-2 flex justify-center">
                            <button
                                onClick={onClose}
                                className="w-11/12 hover:bg-gray-200 rounded-md flex items-center justify-center gap-2 p-2 cursor-pointer"
                            >
                                <LuPencilLine className="cursor-pointer" />
                                <p className="font-semibold">Cập nhật</p>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Modal;
