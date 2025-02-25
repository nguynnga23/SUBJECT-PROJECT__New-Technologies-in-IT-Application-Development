import { useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { FaUser, FaCalendarAlt } from 'react-icons/fa';

function TabChatRightBarSearch() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="w-1/4 h-screen bg-white border-l min-w-[350px] dark:bg-gray-800 dark:text-gray-300 dark:border-l-black">
            {/* Header */}
            <div className="relative flex justify-center items-center h-[62px] border-b dark:border-b-black">
                <h2 className="text-lg font-semibold p-1">Tìm kiếm trong trò chuyện</h2>
            </div>

            {/* Search Input */}
            <div className="relative p-4">
                <IoSearchOutline className="absolute top-7 left-5 text-gray-400 " size={18} />
                <input
                    type="text"
                    className="w-full pl-8 pr-3 py-2 border rounded-md focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-black"
                    placeholder="Nhập từ khóa tìm kiếm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Filter Options */}
            <div className="flex items-center gap-2 mt-4 justify-around">
                <p className=" text-[12px]">Lọc theo: </p>
                <button className="flex items-center gap-2 px-5 py-1.5 border rounded-md text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-100 text-[12px]">
                    <FaUser size={14} />
                    Người gửi
                </button>
                <button className="flex items-center gap-2 px-5 py-1.5 border rounded-md text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-100 text-[12px]">
                    <FaCalendarAlt size={14} />
                    Ngày gửi
                </button>
            </div>

            {/* Empty Search Result */}
            {searchTerm === '' && (
                <div className="mt-20 text-center text-gray-500 p-4">
                    <div className="flex justify-center mb-4">
                        <div className="bg-blue-100 p-5 rounded-full">
                            <img
                                src="https://chat.zalo.me/assets/search_empty_keyword_state.b291c6f32343a363d7bd2d062ba1cf04.png"
                                className="w-[80px]"
                                alt="zalo"
                            />
                        </div>
                    </div>
                    <p>Hãy nhập từ khóa để bắt đầu tìm kiếm tin nhắn và file trong trò chuyện</p>
                </div>
            )}
        </div>
    );
}

export default TabChatRightBarSearch;
