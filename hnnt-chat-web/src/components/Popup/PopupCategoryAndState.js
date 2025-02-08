import { useState, useEffect, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { FaCircle } from 'react-icons/fa';
import { FaRegSquare } from 'react-icons/fa6';
import { FaRegSquareCheck } from 'react-icons/fa6';

import PopupReaded from './PopupReaded';

const categories = [
    { id: 1, name: 'Khách hàng', color: 'bg-red-500' },
    { id: 2, name: 'Gia đình', color: 'bg-green-500' },
    { id: 3, name: 'Công việc', color: 'bg-orange-500' },
    { id: 4, name: 'Bạn bè', color: 'bg-purple-500' },
    { id: 5, name: 'Trả lời sau', color: 'bg-yellow-500' },
    { id: 6, name: 'Đồng nghiệp', color: 'bg-blue-500' },
    { id: 7, name: 'Tin nhắn từ người lạ', color: 'bg-gray-500' },
];

const states = [
    { id: 1, name: 'Tất cả' },
    { id: 2, name: 'Chưa đọc' },
];

function PopupCategoryAndState() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const popupContainerRef = useRef(null);

    // Hàm đóng popup khi click bên ngoài
    useEffect(() => {
        function handleClickOutside(event) {
            if (popupContainerRef.current && !popupContainerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
        <div className="relative inline-block text-left" ref={popupContainerRef}>
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
                                onClick={() => toggleCategory(category)}
                                className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                            >
                                {selectedCategories.some((c) => c.id === category.id) ? (
                                    <FaRegSquareCheck className="mr-3 text-blue-500" />
                                ) : (
                                    <FaRegSquare className="mr-3 text-gray-500" />
                                )}

                                <span className={`w-3 h-3 rounded-full ${category.color} mr-3`}></span>
                                <span className="flex-1 text-sm">{category.name}</span>
                            </div>
                        ))}
                        <p className="flex justify-center item-center cursor-pointer py-2 text-sm font-bold hover:bg-gray-100 text-gray-700 border-t pt-1">
                            Quản lý thẻ phân loại
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PopupCategoryAndState;
