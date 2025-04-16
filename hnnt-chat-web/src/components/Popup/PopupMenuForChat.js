import { useEffect, useRef } from 'react';
import { MdContentCopy, MdPushPin, MdDelete } from 'react-icons/md';
import { IoReload } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { deleteMessage, destroyMessage, pinOfMessage } from '../../screens/Messaging/api';
import { socket } from '../../configs/socket';

function PopupMenuForChat({ setIsPopupOpen, position, message }) {
    const popupRef = useRef(null);
    const chat = useSelector((state) => state.chat.activeChat);

    const handleDeleteMessage = async (messageId) => {
        if (!chat) return;
        await deleteMessage(messageId);

        setIsPopupOpen(null);
    };

    const handleDestroyMessage = async (messageId) => {
        if (!chat) return;
        await destroyMessage(messageId);
        setIsPopupOpen(null);
    };

    const handleCopy = () => {
        const textToCopy = message.content;
        navigator.clipboard.writeText(textToCopy).catch((err) => console.error('Lỗi sao chép: ', err));
        setIsPopupOpen(null);
    };

    const handlePinMessages = (messageId) => {
        const pinMess = pinOfMessage(messageId);
        if (!pinMess) return;
        // socket.emit('pin_message', {
        //     chatId: chat.id,
        // });
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
                position === 'left' ? 'left-[10px]' : 'right-[10px]'
            } top-[5px] w-52 bg-white shadow-lg rounded-lg border border-gray-200 z-50 text-[12px]`}
        >
            <div className="py-2">
                {!message?.destroy && (
                    <ul>
                        {message.type === 'text' && (
                            <li
                                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={handleCopy}
                            >
                                <MdContentCopy className="mr-3" />
                                Copy tin nhắn
                            </li>
                        )}
                        <li
                            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handlePinMessages(message?.id)}
                        >
                            <MdPushPin className="mr-3" />
                            Ghim tin nhắn
                        </li>
                    </ul>
                )}
                <li
                    className="flex items-center px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                        handleDeleteMessage(message?.id);
                    }}
                >
                    <MdDelete className="mr-3" />
                    Xóa
                </li>
                {position === 'right' && !message?.destroy && (
                    <li
                        className="flex items-center px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleDestroyMessage(message?.id)}
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
