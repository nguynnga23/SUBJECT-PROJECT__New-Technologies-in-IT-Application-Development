import { useState, useEffect, useRef } from 'react';
import { MdLabel } from 'react-icons/md';

import PopupManageCategory from './PopupManageCategory';

const categories = [
    { id: 1, name: 'Khách hàng', color: 'text-red-500' },
    { id: 2, name: 'Gia đình', color: 'text-green-500' },
    { id: 3, name: 'Công việc', color: 'text-orange-500' },
    { id: 4, name: 'Bạn bè', color: 'text-purple-500' },
    { id: 5, name: 'Trả lời sau', color: 'text-yellow-500' },
    { id: 6, name: 'Đồng nghiệp', color: 'text-blue-500' },
    { id: 7, name: 'Tin nhắn từ người lạ', color: 'text-gray-500' },
];

function PopupCategory({ isOpen, setIsOpen }) {
    const [isOpenManageCategory, setIsOpenManageCategory] = useState(false);

    const popupContainerRef = useRef(null);

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
        setIsOpen(false);
        return;
    };

    return (
        <div className="relative inline-block text-left" ref={popupContainerRef}>
            {isOpen && (
                <div className="absolute mt-11 left-[-105px] w-56 bg-white shadow-lg rounded-lg border">
                    <div className="">
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
                </div>
            )}
        </div>
    );
}

export default PopupCategory;
