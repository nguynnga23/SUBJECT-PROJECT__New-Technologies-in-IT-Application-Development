import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { IoIosArrowUp } from 'react-icons/io';

function TabSettingPrivate() {
    const [showStatus, setShowStatus] = useState(false);
    const [showSeenStatus, setShowSeenStatus] = useState(false);
    const [showBlockList, setShowBlockList] = useState(false);

    return (
        <div className="max-w-md mx-auto rounded-lg text-[12px]">
            {/* Cá nhân */}
            <div className="mb-6">
                <h2 className="text-[14px] font-semibold mb-2">Cá nhân</h2>
                <div className="bg-white p-4 rounded-lg shadow  dark:bg-gray-800 dark:text-gray-300">
                    <div className="mb-4">
                        <label className="block">Hiện ngày sinh</label>
                        <select className="w-full mt-1 p-2 border rounded-lg  dark:bg-gray-700 dark:text-gray-300">
                            <option>Không hiện</option>
                            <option>Hiện</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Hiển thị trạng thái truy cập</span>
                        <input
                            type="checkbox"
                            checked={showStatus}
                            onChange={() => setShowStatus(!showStatus)}
                            className="ml-2 w-5 h-5"
                        />
                    </div>
                </div>
            </div>

            {/* Tin nhắn và cuộc gọi */}
            <div className="mb-6">
                <h2 className="text-[14px] font-semibold mb-2">Tin nhắn và cuộc gọi</h2>
                <div className="bg-white p-4 rounded-lg shadow  dark:bg-gray-800 dark:text-gray-300">
                    <div className="flex items-center justify-between mb-4">
                        <span>Hiện trạng thái "Đã xem"</span>
                        <input
                            type="checkbox"
                            checked={showSeenStatus}
                            onChange={() => setShowSeenStatus(!showSeenStatus)}
                            className="ml-2 w-5 h-5"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block">Cho phép nhắn tin</label>
                        <select className="w-full mt-1 p-2 border rounded-lg  dark:bg-gray-700 dark:text-gray-300">
                            <option>Tất cả mọi người</option>
                            <option>Bạn bè</option>
                            <option>Không ai</option>
                        </select>
                    </div>
                    <div>
                        <label className="block">Cho phép gọi điện</label>
                        <select className="w-full mt-1 p-2 border rounded-lg  dark:bg-gray-700 dark:text-gray-300">
                            <option>Bạn bè và người lạ từng liên hệ</option>
                            <option>Chỉ bạn bè</option>
                            <option>Không ai</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Chặn tin nhắn */}
            <div>
                <h2 className="text-[14px] font-semibold mb-2">Chặn tin nhắn</h2>
                <div
                    className="bg-white p-4 rounded-lg shadow flex justify-between items-center cursor-pointer dark:bg-gray-800 dark:text-gray-300"
                    onClick={() => setShowBlockList(!showBlockList)}
                >
                    <span className="text-sm">Danh sách chặn</span>
                    <button className="text-blue-600 font-medium">
                        {showBlockList ? <IoIosArrowDown size={14} /> : <IoIosArrowUp size={14} />}
                    </button>
                </div>
                {showBlockList && (
                    <div className="bg-white p-4 rounded-lg shadow mt-[1px] dark:bg-gray-800 dark:text-gray-300">
                        <p className="text-sm">Danh sách chặn đang trống.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TabSettingPrivate;
