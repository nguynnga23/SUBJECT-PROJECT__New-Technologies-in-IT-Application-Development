import { useState, useEffect, useRef } from 'react';
import CoverPhoto from '../../public/cover_photo_sample.jpg';

import { CiCamera } from 'react-icons/ci';
import { LuPencilLine } from 'react-icons/lu';
import { IoIosArrowBack } from 'react-icons/io';
import { MdOutlineInsertPhoto } from 'react-icons/md';

import { motion } from 'framer-motion';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useSelector } from 'react-redux';

import PopupViewImage from '../Popup/PopupViewImage';
import ModalAccount from './ModalAccount';

function ModalAvatar({ setImage, setIsType }) {
    const userActive = useSelector((state) => state.auth.userActive);
    const Avatar = userActive?.avatar;

    // lấy ảnh từ máy
    const fileInputRef = useRef(null);

    const handleTakePhoto = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <motion.div
            initial={{ x: '100%', opacity: 0 }} // Bắt đầu ngoài màn hình bên phải
            animate={{ x: '0%', opacity: 1 }} // Trượt vào giữa màn hình
            exit={{ x: '100%', opacity: 0 }} // Khi đóng, trượt ngược ra phải
            transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
            <div className="border-t pt-2 flex justify-center">
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const imageUrl = URL.createObjectURL(file); // Tạo URL tạm thời
                            setImage(imageUrl);
                            setIsType('editAvatar');
                        }
                    }}
                />
                <button
                    onClick={handleTakePhoto}
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
    );
}

export default ModalAvatar;
