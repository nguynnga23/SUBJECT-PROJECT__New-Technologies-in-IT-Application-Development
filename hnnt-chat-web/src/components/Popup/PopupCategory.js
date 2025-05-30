import { useState, useEffect, useRef } from 'react';
import { MdLabel } from 'react-icons/md';
import { addOrChangeCategory } from '../../redux/slices/chatSlice';

import PopupManageCategory from './PopupManageCategory';
import { useDispatch, useSelector } from 'react-redux';
import { addCategoryToChat, getAllCategory } from '../../screens/Messaging/api';

function PopupCategory({ isOpen, setIsOpen }) {
    const [data, setData] = useState([]);
    const [error, setError] = useState([]);
    const [isOpenManageCategory, setIsOpenManageCategory] = useState(false);
    const activeChat = useSelector((state) => state.chat.activeChat);
    const userActive = useSelector((state) => state.auth.userActive);

    const popupContainerRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const chats = await getAllCategory();
                setData(chats);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchChats(); // Gọi hàm async bên trong useEffect
    }, [data]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupContainerRef.current && !popupContainerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, setIsOpen]);

    const chooseCategory = (category) => {
        const chatId = activeChat.id;
        addCategoryToChat(chatId, category.id);
        dispatch(addOrChangeCategory({ chatId, userId: userActive.id, category }));
        setIsOpen(false);
        return;
    };

    return (
        <div className="relative inline-block text-left" ref={popupContainerRef}>
            {isOpen && (
                <div className="absolute mt-11 left-[-105px] top-[10px] w-56 bg-white shadow-lg rounded-lg z-[10]">
                    <div className="overflow-auto max-h-[300px] dark:bg-gray-900 dark:text-gray-300 rounded-t-lg">
                        {data.map((category) => (
                            <div
                                key={category.id}
                                onClick={() => chooseCategory(category)}
                                className="flex items-center p-2 hover:bg-gray-300 hover:dark:bg-gray-700 rounded-lg cursor-pointer"
                            >
                                <MdLabel className={`mr-3 ${category.color}`} size={18} />
                                <span className="flex-1 text-sm max-w-[180px] truncate">{category.name}</span>
                            </div>
                        ))}
                    </div>
                    <p
                        className="flex justify-center item-center cursor-pointer py-2 text-sm font-bold hover:bg-gray-300 hover:dark:bg-gray-700 text-gray-700 border-t pt-1 dark:bg-gray-900 dark:text-gray-300"
                        onClick={() => setIsOpenManageCategory(true)}
                    >
                        Quản lý thẻ phân loại
                    </p>
                    {isOpenManageCategory && (
                        <PopupManageCategory
                            setIsOpenManageCategory={setIsOpenManageCategory}
                            isOpenManageCategory={isOpenManageCategory}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default PopupCategory;
