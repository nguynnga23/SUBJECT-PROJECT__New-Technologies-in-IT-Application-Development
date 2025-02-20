import { useEffect, useRef } from 'react';
import { HiBellSlash } from 'react-icons/hi2';
import { TiPin } from 'react-icons/ti';
import { MdDelete } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { setOnOrOfPin, setOnOrOfNotify, deleteChatForUser } from '../../redux/slices/chatSlice';

function PopupMenuForMess({ setShowPopup, setHoveredMessage, chat }) {
    const popupRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowPopup(false); // Đóng popup khi click ra ngoài
                setHoveredMessage(null);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setShowPopup]);

    return (
        <div
            className={`absolute right-[0] top-[-10px] w-40 z-[10] bg-white shadow-lg rounded-lg border border-gray-200 z-999`}
            ref={popupRef}
        >
            <div className="">
                <ul>
                    <li
                        className="flex text-[12px] items-center px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                        onClick={() => {
                            dispatch(setOnOrOfPin(chat.id));
                            setShowPopup(false); // Đóng popup khi click ra ngoài
                            setHoveredMessage(null);
                        }}
                    >
                        <TiPin size={13} className={`mr-2 ${chat.pin ? 'text-blue-500' : 'text-gray-500'}`} />{' '}
                        {!chat.pin ? 'Ghim hội thoại' : 'Bỏ ghim hội thoại'}
                    </li>
                    <li
                        className="flex text-[12px] items-center px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                        onClick={() => {
                            dispatch(setOnOrOfNotify(chat.id));
                            setShowPopup(false); // Đóng popup khi click ra ngoài
                            setHoveredMessage(null);
                        }}
                    >
                        <HiBellSlash size={13} className={`mr-2 ${!chat.notify ? 'text-blue-500' : 'text-gray-500'}`} />{' '}
                        {!chat.notify ? 'Mở thông báo' : 'Tắt thông báo'}
                    </li>
                    <li
                        className="flex text-[12px] items-center text-red-500 px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                        onClick={() => dispatch(deleteChatForUser({ userId: 0, chatId: chat.id }))}
                    >
                        <MdDelete size={13} className="mr-2 text-red-500" />
                        Xóa tin nhắn
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default PopupMenuForMess;
