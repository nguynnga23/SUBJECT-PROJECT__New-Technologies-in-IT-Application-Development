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
import ModalAvatar from './ModalAvatar';
import ModalEdit from './ModalEdit';
import ModalEditAvatar from './ModalEditAvatar';

function Modal({ isOpen, onClose }) {
    const userActive = useSelector((state) => state.auth.userActive);
    const Avatar = userActive?.avatar;

    const [isType, setIsType] = useState('profile');
    const [isName, setIsName] = useState(userActive?.name);
    const [gender, setGender] = useState(userActive?.gender);

    // -----------------------------------------------------
    const currentYear = new Date().getFullYear();

    const [day, setDay] = useState(31);
    const [month, setMonth] = useState(1);
    const [year, setYear] = useState(2025);
    const [maxDays, setMaxDays] = useState(31);

    // Hàm kiểm tra số ngày hợp lệ trong tháng
    const getMaxDays = (month, year) => {
        if ([4, 6, 9, 11].includes(month)) return 30; // Tháng 4, 6, 9, 11 có 30 ngày
        if (month === 2) return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28; // Tháng 2
        return 31; // Các tháng còn lại có 31 ngày
    };

    // Cập nhật số ngày hợp lệ khi tháng hoặc năm thay đổi
    useEffect(() => {
        const newMaxDays = getMaxDays(month, year);
        setMaxDays(newMaxDays);

        if (day > newMaxDays) {
            setDay(newMaxDays); // Giữ ngày trong phạm vi hợp lệ
        }
    }, [month, year]);

    // lấy ảnh từ máy
    const fileInputRef = useRef(null);

    const handleTakePhoto = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const [image, setImage] = useState(null);

    const [selectedImage, setSelectedImage] = useState(null);

    // Đống mở modal
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="bg-white rounded-md shadow-lg py-2 w-full max-w-sm h-[80vh] flex flex-col relative overflow-hidden"
            >
                <div className="flex justify-between px-4 items-center mb-4">
                    {isType === 'avatar' || isType === 'editAvatar' ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    if (isType === 'avatar') {
                                        setIsType('profile');
                                    } else {
                                        setIsType('avatar');
                                    }
                                }}
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
                        onClick={() => {
                            onClose();
                            setIsType('profile');
                        }}
                        className="w-8 h-8 flex items-center justify-center text-black hover:text-gray-700 hover:bg-gray-200 rounded-full text-xl"
                    >
                        ✕
                    </button>
                </div>

                {isType === 'avatar' ? (
                    <ModalAvatar setImage={setImage} setIsType={setIsType} />
                ) : isType === 'edit' ? (
                    <ModalEdit setIsType={setIsType} onClose={onClose} />
                ) : isType === 'editAvatar' ? (
                    image && (
                        <ModalEditAvatar image={image} setIsType={setIsType} onClose={onClose} />
                        // <>
                        //     <div className="flex-1 overflow-auto pt-6 border-t border-gray-200 relative">
                        //         <div className="w-full flex justify-center relative">
                        //             {/* Ảnh hiển thị */}
                        //             <img src={image} alt="Preview" className="mt-2 max-w-full h-80 object-cover " />

                        //             {/* Lớp mờ với vùng tròn trong suốt */}
                        //             <div
                        //                 className="absolute inset-0 bg-black/50"
                        //                 style={{
                        //                     WebkitMaskImage: `radial-gradient(circle 160px at center, transparent 160px, black 161px)`,
                        //                     maskImage: `radial-gradient(circle 160px at center, transparent 160px, black 161px)`,
                        //                 }}
                        //             />
                        //         </div>
                        //     </div>
                        //     {/* button cập nhật */}
                        //     <div className="border-t pt-2 flex justify-end mt-auto">
                        //         <button
                        //             onClick={() => setIsType('avatar')}
                        //             className="bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center gap-2 p-2 cursor-pointer mr-2"
                        //         >
                        //             <p className="font-semibold">Hủy</p>
                        //         </button>

                        //         <button
                        //             onClick={onClose}
                        //             className="bg-blue-600 hover:bg-blue-800 rounded-md flex items-center justify-center gap-2 p-2 cursor-pointer mr-3"
                        //         >
                        //             <p className="font-semibold text-white">Cập nhật</p>
                        //         </button>
                        //     </div>
                        // </>
                    )
                ) : (
                    <ModalAccount setIsType={setIsType} />
                )}
            </motion.div>
        </div>
    );
}

export default Modal;
