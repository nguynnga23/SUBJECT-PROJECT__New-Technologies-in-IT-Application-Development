import React, { useEffect, useState } from 'react';
import { MdLabel, MdDelete, MdLabelOutline } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import { BsGripVertical } from 'react-icons/bs';
import PopupCategoryColor from './PopupCategoryColor';
import { useDispatch, useSelector } from 'react-redux';
import { addCategory, deleteCategory } from '../../redux/slices/categorySlice';

const PopupManageCategory = ({ setIsOpenManageCategory }) => {
    const categories = useSelector((state) => state.category.categories);
    const [newCategory, setNewCategory] = useState('');
    const [hoveredId, setHoveredId] = useState(null);
    const [showPopupColor, setShowPopupColor] = useState(false);
    const [color, setColor] = useState('');
    const dispatch = useDispatch();

    const handleClose = () => {
        setIsOpenManageCategory(false);
    };

    // Thêm phân loại mới
    const handleAddCategory = () => {
        if (newCategory.trim() === '') return;

        const newEntry = {
            name: newCategory,
            color: color,
        };
        dispatch(addCategory(newEntry));

        setNewCategory('');
    };

    // Xóa phân loại
    const handleDeleteCategory = (id) => {
        dispatch(deleteCategory({ id }));
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg w-[400px] shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b dark:border-b-black">
                    <h2 className="text-lg font-semibold">Quản lý thẻ phân loại</h2>
                    <button onClick={handleClose} className="text-gray-600 hover:text-black">
                        <IoMdClose size={22} />
                    </button>
                </div>

                {/* Danh sách thẻ phân loại */}
                <div className="p-4  max-h-[350px] overflow-y-auto">
                    <h3 className="text-sm text-gray-600 mb-2">Danh sách thẻ phân loại</h3>
                    <div className="space-y-2">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="flex items-center bg-gray-100 dark:bg-gray-800 p-2 rounded-lg relative"
                                onMouseEnter={() => setHoveredId(category.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                <BsGripVertical className="text-gray-500 mr-2" />
                                <MdLabel className={`${category.color}`} size={18} />
                                <span className="ml-3 text-sm font-medium flex-1">{category.name}</span>

                                {/* Hiển thị icon xóa khi hover */}
                                {hoveredId === category.id && (
                                    <button
                                        className="text-gray-500 hover:text-red-500"
                                        onClick={() => handleDeleteCategory(category.id)}
                                    >
                                        <MdDelete size={18} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Thêm phân loại */}
                <div className="p-4 border-t">
                    <div className="flex items-center space-x-2">
                        <div className="relative">
                            {color !== '' ? (
                                <MdLabel
                                    className={`cursor-pointer ${color} text-[20px]`}
                                    onClick={() => setShowPopupColor(!showPopupColor)}
                                />
                            ) : (
                                <MdLabelOutline
                                    className={`cursor-pointer text-gray-400 text-[20px]`}
                                    onClick={() => setShowPopupColor(!showPopupColor)}
                                />
                            )}

                            {showPopupColor && (
                                <PopupCategoryColor setColor={setColor} setShowPopupColor={setShowPopupColor} />
                            )}
                        </div>

                        <input
                            type="text"
                            className="border rounded-lg px-3 py-1 w-full focus:border-blue-500 focus:outline-none dark:bg-gray-800"
                            placeholder="Nhập tên phân loại..."
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                        />
                        <button
                            className="text-white bg-blue-500 w-[30px] h-[30px] text-center rounded-lg font-bold"
                            onClick={handleAddCategory}
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopupManageCategory;
