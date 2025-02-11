import { useEffect, useRef } from 'react';
import { MdContentCopy, MdPushPin, MdDelete } from 'react-icons/md';
import { FaRegStar } from 'react-icons/fa';
import { HiOutlineInformationCircle } from 'react-icons/hi';

function PopupMenuForChat({ setIsPopupOpen }) {
    const popupRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setIsPopupOpen(null); // Đóng popup khi click ra ngoài
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setIsPopupOpen]);

    return (
        <div
            ref={popupRef}
            className="absolute top-8 right-2 w-52 bg-white shadow-lg rounded-lg border border-gray-200 z-50"
        >
            <ul className="py-2">
                <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <MdContentCopy className="mr-3" />
                    Copy tin nhắn
                </li>
                <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <MdPushPin className="mr-3" />
                    Ghim tin nhắn
                </li>
                <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <FaRegStar className="mr-3" />
                    Đánh dấu tin nhắn
                </li>
                <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <HiOutlineInformationCircle className="mr-3" />
                    Xem chi tiết
                </li>
                <li className="flex items-center px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer">
                    <MdDelete className="mr-3" />
                    Xóa
                </li>
            </ul>
        </div>
    );
}

export default PopupMenuForChat;
