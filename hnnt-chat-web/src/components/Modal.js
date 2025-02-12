import React from 'react';
import CoverPhoto from '../public/cover_photo_sample.jpg';
import Avatar from '../public/avatar_sample.jpg';

import { CiCamera } from 'react-icons/ci';
import { LuPencilLine } from 'react-icons/lu';

function Modal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-md shadow-lg py-6 w-full max-w-sm h-[80vh] flex flex-col">
                <div className="flex justify-between px-6 align-center mb-4">
                    <p className="text-md font-semibold">Thông tin tài khoản</p>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-auto relative">
                    <img src={CoverPhoto} alt="Mô tả hình ảnh" className="w-full h-[200px] cursor-pointer" />

                    <div className="absolute top-44 left-0 w-[80px] h-[80px] rounded-full shadow-lg overflow-hidden ml-6  border-4 border-gray-300 cursor-pointer">
                        <img src={Avatar} alt="Ảnh phụ" className="w-full h-full object-cover" />
                    </div>

                    <div className="absolute top-56 left-20 w-8 h-8 bg-gray-200 border border-gray-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300">
                        <CiCamera className="w-4 h-4 text-sm" />
                    </div>

                    <div className="absolute top-52 left-32 flex items-center justify-center ">
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
            </div>
        </div>
    );
}

export default Modal;
