import { useState, useEffect, useRef } from 'react';
import { MdLabel } from 'react-icons/md';
import { addOrChangeCategory } from '../../redux/slices/chatSlice';

import PopupManageCategory from './PopupManageCategory';
import { useDispatch, useSelector } from 'react-redux';

function PopupCategory({ isOpen, setIsOpen }) {
    const categories = useSelector((state) => state.category.categories);
    const [isOpenManageCategory, setIsOpenManageCategory] = useState(false);
    const activeChat = useSelector((state) => state.chat.activeChat);

    const popupContainerRef = useRef(null);
    const dispatch = useDispatch();

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
    }, [isOpen]);

    const chooseCategory = (category) => {
        const chatId = activeChat.id;
        dispatch(addOrChangeCategory({ chatId, category }));
        setIsOpen(false);
        return;
    };

    return (
        <div className="relative inline-block text-left" ref={popupContainerRef}>
            {isOpen && (
                <div className="absolute mt-11 left-[-105px] w-56 bg-white shadow-lg rounded-lg border z-[10]">
                    <div className="overflow-auto max-h-[300px]">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                onClick={() => chooseCategory(category)}
                                className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                            >
                                <MdLabel className={`mr-3 ${category.color}`} size={18} />
                                <span className="flex-1 text-sm">{category.name}</span>
                            </div>
                        ))}
                    </div>
                    <p
                        className="flex justify-center item-center cursor-pointer py-2 text-sm font-bold hover:bg-gray-100 text-gray-700 border-t pt-1"
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
