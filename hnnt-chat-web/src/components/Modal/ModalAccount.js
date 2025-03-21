import React, { useState } from 'react';

import CoverPhoto from '../../public/cover_photo_sample.jpg';

import { CiCamera } from 'react-icons/ci';
import { LuPencilLine } from 'react-icons/lu';

import PopupViewImage from '../Popup/PopupViewImage';

import { useSelector } from 'react-redux';

function ModalAccount({ setIsType }) {
    const userActive = useSelector((state) => state.auth.userActive);
    const Avatar = userActive?.avatar;

    const date = new Date(userActive?.birthDate);
    const formattedDate = date
        .toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })
        .replace('tháng', 'tháng ');

    const [selectedImage, setSelectedImage] = useState(null);
    return (
        <>
            <div className="flex-1 overflow-auto relative">
                {/*Nhấn vào hình bật popup  */}
                {selectedImage && <PopupViewImage selectedImage={selectedImage} setSelectedImage={setSelectedImage} />}
                <img
                    src={CoverPhoto}
                    alt="Ảnh phụ"
                    className="w-full h-[200px] cursor-pointer"
                    onClick={() => setSelectedImage(CoverPhoto)}
                />

                <div
                    className="absolute top-44 left-0 w-[80px] h-[80px] rounded-full shadow-lg overflow-hidden ml-6  border-4 border-gray-300 cursor-pointer"
                    onClick={() => setSelectedImage(Avatar)}
                >
                    <img src={Avatar} alt="Avartar" className="w-full h-full object-cover" />
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
                    <p className="font-semibold mr-3">{userActive?.name}</p>
                    <LuPencilLine className="cursor-pointer" />
                </div>

                <div className="absolute w-full h-1 bg-gray-200 top-60 mt-6"></div>

                <div className="absolute px-6 top-64 mt-3">
                    <p className="font-semibold">Thông tin cá nhân</p>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-sm">
                        <p className="text-gray-500">Giới tính</p>
                        <p>{userActive?.gender}</p>

                        <p className="text-gray-500">Ngày sinh</p>
                        <p>{formattedDate}</p>

                        <p className="text-gray-500">Điện thoại</p>
                        <p>+84 {userActive?.number}</p>
                    </div>

                    <p className="text-gray-500 mt-3 text-xs">
                        Chỉ bạn bè có thể lưu số của bạn trong danh bạ máy xem được số này
                    </p>
                </div>
            </div>

            <div className="border-t pt-2 flex justify-center">
                <button
                    onClick={() => setIsType('edit')}
                    className="w-11/12 hover:bg-gray-200 rounded-md flex items-center justify-center gap-2 p-2 cursor-pointer"
                >
                    <LuPencilLine className="cursor-pointer" />
                    <p className="font-semibold">Cập nhật</p>
                </button>
            </div>
        </>
    );
}

export default ModalAccount;
