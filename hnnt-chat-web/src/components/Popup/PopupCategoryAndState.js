import { useState, useEffect, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { FaCircle } from 'react-icons/fa';
import { FaRegSquare } from 'react-icons/fa6';
import { FaRegSquareCheck } from 'react-icons/fa6';
import { MdLabel } from 'react-icons/md';

import PopupReaded from './PopupReaded';
import PopupManageCategory from './PopupManageCategory';
import { useDispatch, useSelector } from 'react-redux';
import { setCategory } from '../../redux/slices/categorySlice';

const states = [
    { id: 1, name: 'Tất cả' },
    { id: 2, name: 'Chưa đọc' },
];

function PopupCategoryAndState() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isOpenManageCategory, setIsOpenManageCategory] = useState(false);
    const categories = useSelector((state) => state.category.categories);
    const popupContainerRef = useRef(null);

    const dispatch = useDispatch();

    // Hàm đóng popup khi click bên ngoài
    useEffect(() => {
        function handleClickOutside(event) {
            if (popupContainerRef.current && !popupContainerRef.current.contains(event.target)) {
                if (!isOpenManageCategory) {
                    setIsOpen(false);
                }
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const toggleCategory = (category) => {
        setSelectedCategories((prevSelected) => {
            const updatedCategories = prevSelected.some((c) => c.id === category.id)
                ? prevSelected.filter((c) => c.id !== category.id)
                : [...prevSelected, category];

            // Cập nhật Redux sau khi state đã thay đổi
            setTimeout(() => {
                dispatch(setCategory(updatedCategories));
            }, 0);

            return updatedCategories; // Trả về giá trị mới cho state cục bộ
        });
    };

    return (
        <div className="relative inline-block text-left z-[10]" ref={popupContainerRef}>
            {/* Nút mở dropdown */}
            <div className="h-full flex items-center">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`px-2 py-1 text-xs mr-1 rounded-lg flex items-center gap-2 cursor-pointer ${
                        isOpen ? 'bg-blue-400 text-white' : ''
                    }`}
                >
                    Phân loại <FaChevronDown />
                </button>
                <PopupReaded />
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg border">
                    <div className="p-2">
                        {/* Theo trạng thái */}
                        <p className="text-sm font-bold text-gray-700 mb-2">Theo trạng thái</p>
                        {states.map((state) => (
                            <div
                                key={state.id}
                                onClick={() => setSelectedState(state)}
                                className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                            >
                                {selectedState?.id === state.id ? (
                                    <FaCircle className={`mr-3 cursor-pointer text-blue-500`} />
                                ) : (
                                    <FaCircle className={`mr-3 cursor-pointer text-gray-500`} />
                                )}
                                <span className="flex-1 text-sm">{state.name}</span>
                            </div>
                        ))}

                        {/* Theo thẻ phân loại */}
                        <p className="text-sm font-bold text-gray-700 mt-3 mb-2 border-t pt-1">Theo thẻ phân loại</p>
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                onClick={() => {
                                    toggleCategory(category);
                                }}
                                className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                            >
                                {selectedCategories.some((c) => c.id === category.id) ? (
                                    <FaRegSquareCheck className="mr-3 text-blue-500" />
                                ) : (
                                    <FaRegSquare className="mr-3 text-gray-500" />
                                )}
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

export default PopupCategoryAndState;
