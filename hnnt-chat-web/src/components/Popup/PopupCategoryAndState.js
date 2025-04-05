import { useState, useEffect, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { FaCircle } from 'react-icons/fa';
import { FaRegSquare } from 'react-icons/fa6';
import { FaRegSquareCheck } from 'react-icons/fa6';
import { MdLabel } from 'react-icons/md';

import PopupReaded from './PopupReaded';
import PopupManageCategory from './PopupManageCategory';
import { useDispatch } from 'react-redux';
import { setCategory, setState } from '../../redux/slices/categorySlice';
import { getAllCategory } from '../../screens/Messaging/api';

function PopupCategoryAndState() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isOpenManageCategory, setIsOpenManageCategory] = useState(false);
    const [stateOfChat, setStateOfChat] = useState('Tất cả');
    const [data, setData] = useState([]);
    const popupContainerRef = useRef(null);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const chats = await getAllCategory();
                setData(chats);
            } catch (err) {
                console.log(err.message);
            }
        };

        fetchChats(); // Gọi hàm async bên trong useEffect
    }, [data]);

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
    }, [isOpen, isOpenManageCategory]);

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

    const toggleState = (state) => {
        setStateOfChat(state);
        dispatch(setState(state));
    };

    return (
        <div className="relative inline-block text-left z-[10]" ref={popupContainerRef}>
            {/* Nút mở dropdown */}
            <div className="h-full flex items-center">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`px-2 py-1 text-xs mr-1 rounded-lg flex items-center gap-2 cursor-pointer dark:text-gray-300 ${
                        isOpen ? 'bg-blue-400 text-white' : ''
                    }`}
                >
                    {stateOfChat} <FaChevronDown />
                </button>
                <PopupReaded />
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 shadow-lg rounded-t-lg border dark:border-gray-900 dark:text-gray-300">
                    <div className="p-2 ">
                        <p className="text-sm font-bold text-gray-700 pt-1 mb-2 dark:text-gray-300">Theo trạng thái</p>

                        {/* Theo trạng thái */}
                        <div
                            onClick={() => toggleState('Tất cả')}
                            className="flex items-center p-2 dark:bg-gray-900 hover:bg-gray-300 hover:dark:bg-gray-700 rounded-lg cursor-pointer"
                        >
                            {stateOfChat === 'Tất cả' ? (
                                <FaCircle className={`mr-3 cursor-pointer text-blue-500`} />
                            ) : (
                                <FaCircle className={`mr-3 cursor-pointer text-gray-500`} />
                            )}
                            <span className="flex-1 text-sm">Tất cả</span>
                        </div>
                        <div
                            onClick={() => toggleState('Chưa đọc')}
                            className="flex items-center p-2 dark:bg-gray-900 hover:bg-gray-300 hover:dark:bg-gray-700 rounded-lg cursor-pointer"
                        >
                            {stateOfChat === 'Chưa đọc' ? (
                                <FaCircle className={`mr-3 cursor-pointer text-blue-500`} />
                            ) : (
                                <FaCircle className={`mr-3 cursor-pointer text-gray-500`} />
                            )}
                            <span className="flex-1 text-sm">Chưa đọc</span>
                        </div>

                        {/* Theo thẻ phân loại */}
                        <div>
                            <p className="text-sm font-bold text-gray-700 mt-3 mb-2 border-t pt-1 dark:text-gray-300 ">
                                Theo thẻ phân loại
                            </p>
                            <div className=" overflow-auto max-h-[300px]">
                                {data?.map((category) => (
                                    <div
                                        key={category.id}
                                        onClick={() => {
                                            toggleCategory(category);
                                        }}
                                        className="flex items-center p-2 hover:bg-gray-300 hover:dark:bg-gray-700 rounded-lg cursor-pointer"
                                    >
                                        {selectedCategories.some((c) => c.id === category.id) ? (
                                            <FaRegSquareCheck className="mr-3 text-blue-500" />
                                        ) : (
                                            <FaRegSquare className="mr-3 text-gray-500" />
                                        )}
                                        <MdLabel className={`mr-3 ${category.color}`} size={18} />
                                        <span className="flex-1 text-sm max-w-[180px] truncate">{category.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <p
                        className="flex justify-center item-center cursor-pointer py-2 text-sm font-bold dark:bg-gray-900 hover:opacity-60 text-gray-700 border-t pt-1 dark:text-gray-300"
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

export default PopupCategoryAndState;
