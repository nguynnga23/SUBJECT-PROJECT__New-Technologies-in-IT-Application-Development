import { useState, useEffect, useRef } from 'react';

import { IoIosArrowBack } from 'react-icons/io';

import { motion } from 'framer-motion';

import ModalAccount from './ModalAccount';
import ModalAvatar from './ModalAvatar';
import ModalEdit from './ModalEdit';
import ModalEditAvatar from './ModalEditAvatar';

function Modal({ isOpen, onClose }) {
    const [isType, setIsType] = useState('profile');

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

    const [image, setImage] = useState(null);

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
                    image && <ModalEditAvatar image={image} setIsType={setIsType} onClose={onClose} />
                ) : (
                    <ModalAccount setIsType={setIsType} />
                )}
            </motion.div>
        </div>
    );
}

export default Modal;
