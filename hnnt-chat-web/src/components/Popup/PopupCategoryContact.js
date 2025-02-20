import { useState, useEffect, useRef } from 'react';
import { MdLabel } from 'react-icons/md';

import PopupManageCategory from './PopupManageCategory';
import { useSelector } from 'react-redux';

function PopupCategoryContact({ dropdownRef, isDropdownOpen, setIsDropdownOpen, setFilter }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isOpenManageCategory, setIsOpenManageCategory] = useState(false);
    const categories = useSelector((state) => state.category.categories);
    const popupContainerRef = useRef(null);

    // Hàm đóng popup khi click bên ngoài
    useEffect(() => {
        function handleMouseOver(event) {
            if (popupContainerRef.current && popupContainerRef.current.contains(event.target)) {
                setIsOpen(true);
            }
        }

        function handleMouseOut(event) {
            if (popupContainerRef.current && !popupContainerRef.current.contains(event.relatedTarget)) {
                if (!isOpenManageCategory) {
                    setIsOpen(false);
                }
            }
        }

        const popup = popupContainerRef.current;
        if (popup) {
            popup.addEventListener('mouseover', handleMouseOver);
            popup.addEventListener('mouseout', handleMouseOut);
        }

        return () => {
            if (popup) {
                popup.removeEventListener('mouseover', handleMouseOver);
                popup.removeEventListener('mouseout', handleMouseOut);
            }
        };
    }, [isOpen, isOpenManageCategory]);

    const toggleCategory = (category) => {
        setSelectedCategories((prevSelected) => {
            if (prevSelected.some((c) => c.id === category.id)) {
                // Nếu danh mục đã được chọn, bỏ chọn nó
                return prevSelected.filter((c) => c.id !== category.id);
            } else {
                // Nếu chưa chọn, thêm vào danh sách
                return [...prevSelected, category];
            }
        });
    };

    return (
        <div ref={dropdownRef} className="absolute top-0 right-60 mt-2 w-56 bg-white shadow-lg rounded-lg border z-20">
            <div className="p-2">
                {/* Theo thẻ phân loại */}
                <p className="text-sm font-bold text-gray-700 mt-3 mb-2">Theo thẻ phân loại</p>
                {categories.map((category) => (
                    <div
                        key={category.id}
                        onClick={() => {
                            setFilter(category.name);
                            setIsDropdownOpen(!isDropdownOpen);
                        }}
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
    );
}

export default PopupCategoryContact;
