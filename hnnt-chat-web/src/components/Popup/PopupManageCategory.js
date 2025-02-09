import React, { useState } from 'react';
import { MdLabel, MdDelete } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import { BsGripVertical } from 'react-icons/bs';

let ID = 7;
const initialCategories = [
    { id: 1, name: 'Khách hàng', color: 'red-500' },
    { id: 2, name: 'Gia đình', color: 'green-500' },
    { id: 3, name: 'Công việc', color: 'orange-500' },
    { id: 4, name: 'Bạn bè', color: 'purple-500' },
    { id: 5, name: 'Trả lời sau', color: 'yellow-500' },
    { id: 6, name: 'Đồng nghiệp', color: 'blue-500' },
    { id: 7, name: 'Tin nhắn từ người lạ', color: 'text-gray-500' },
];

const PopupManageCategory = ({ setIsOpenManageCategory }) => {
    const [categories, setCategories] = useState(initialCategories);
    const [newCategory, setNewCategory] = useState('');
    const [hoveredId, setHoveredId] = useState(null);

    const handleClose = () => {
        setIsOpenManageCategory(false);
    };

    // Thêm phân loại mới
    const handleAddCategory = () => {
        if (newCategory.trim() === '') return;
        const newEntry = {
            id: ID++,
            name: newCategory,
            color: 'gray-500', // Mặc định màu xám
        };
        setCategories([...categories, newEntry]);
        setNewCategory('');
    };

    // Xóa phân loại
    const handleDeleteCategory = (id) => {
        setCategories(categories.filter((category) => category.id !== id));
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg w-[400px] shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
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
                                className="flex items-center bg-gray-100 p-2 rounded-lg relative"
                                onMouseEnter={() => setHoveredId(category.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                <BsGripVertical className="text-gray-500 mr-2" />
                                <MdLabel className={`text-${category.color}`} size={18} />
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
                        <input
                            type="text"
                            className="border rounded-lg px-3 py-1 w-full focus:border-blue-500 focus:outline-none"
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
