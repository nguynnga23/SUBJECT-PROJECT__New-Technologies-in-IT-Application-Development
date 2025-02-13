import { useEffect, useRef } from 'react';
import { MdContentCopy, MdPushPin, MdDelete } from 'react-icons/md';
import { FaRegStar } from 'react-icons/fa';
import { IoReload } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { updateMessageStatus } from '../../redux/slices/chatSlice';

function PopupMenuForChat({ setIsPopupOpen, position, message }) {
    const popupRef = useRef(null);
    const dispatch = useDispatch();
    const chat = useSelector((state) => state.chat.activeChat);
    const handleToggleStatus = (statusType, messageId) => {
        if (!chat) return;
        dispatch(updateMessageStatus({ chatId: chat.id, messageId, statusType }));

        setIsPopupOpen(null);
    };

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
            className={`absolute ${
                position === 'left' ? 'left-[-5px]' : 'right-[-5px]'
            }  w-52 bg-white shadow-lg rounded-lg border border-gray-200 z-50`}
        >
            <div className="py-2">
                {!message?.destroy && (
                    <ul>
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
                    </ul>
                )}
                <li
                    className="flex items-center px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                        handleToggleStatus('delete', message?.id);
                    }}
                >
                    <MdDelete className="mr-3" />
                    Xóa
                </li>
                {position === 'right' && !message?.destroy && (
                    <li
                        className="flex items-center px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleToggleStatus('destroy', message?.id)}
                    >
                        <IoReload className="mr-3" />
                        Thu hồi
                    </li>
                )}
            </div>
        </div>
    );
}

export default PopupMenuForChat;
