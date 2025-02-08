import { useState } from 'react';
import { FaSearch, FaRegSmile } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { BsThreeDots } from 'react-icons/bs';
import { RiUserAddLine } from 'react-icons/ri';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';

import Popup from '../../components/Popup/PopupCategoryAndState';

const priorityChats = [
    { id: 1, name: 'Nguyen Van A', message: 'Xin chào!', time: '10:00 AM' },
    { id: 2, name: 'Tran Thi B', message: 'Hôm nay bạn thế nào?', time: '11:15 AM' },
];

const categories = [
    { id: 1, name: 'Khách hàng', color: 'bg-red-500' },
    { id: 2, name: 'Gia đình', color: 'bg-green-500' },
    { id: 3, name: 'Công việc', color: 'bg-orange-500' },
    { id: 4, name: 'Bạn bè', color: 'bg-purple-500' },
    { id: 5, name: 'Trả lời sau', color: 'bg-yellow-500' },
    { id: 6, name: 'Đồng nghiệp', color: 'bg-blue-500' },
    { id: 7, name: 'Tin nhắn từ người lạ', color: 'bg-gray-500' },
];

const otherChats = [{ id: 3, name: 'Le Van C', message: 'Hẹn gặp bạn sau!', time: '1:30 PM' }];

function Messaging() {
    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('priority');
    const chats = activeTab === 'priority' ? priorityChats : otherChats;

    return (
        <div className="h-screen flex flex-col">
            <div className="flex-1 flex min-h-0">
                <div className="w-1/4 bg-white border-r p-4">
                    <div className="flex justify-between items-center  relative ">
                        <input type="text" placeholder="Tìm kiếm..." className="w-full pl-10 p-2 border rounded-lg" />
                        <FaSearch className="absolute left-3 top-3 text-gray-500" />
                        <div className="pl-2">
                            <RiUserAddLine size={24} />
                        </div>
                        <div className="pl-2">
                            <AiOutlineUsergroupAdd size={24} />
                        </div>
                    </div>
                    {/* Tabs */}
                    <div className="flex border-b justify-between">
                        <div>
                            <button
                                className={`flex-1 py-2 mr-3 pt-4 text-xs text-center font-medium ${
                                    activeTab === 'priority'
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500'
                                }`}
                                onClick={() => setActiveTab('priority')}
                            >
                                Ưu tiên
                            </button>
                            <button
                                className={`flex-1 py-2 pt-4 text-xs text-center font-medium ${
                                    activeTab === 'other' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                                }`}
                                onClick={() => setActiveTab('other')}
                            >
                                Khác
                            </button>
                        </div>
                        <PopupCategoryAndState />
                    </div>

                    <div>
                        {chats.map((chat) => (
                            <div
                                key={chat.id}
                                className={`p-3 border-b cursor-pointer ${
                                    selectedChat?.id === chat.id ? 'bg-blue-100' : ''
                                }`}
                                onClick={() => setSelectedChat(chat)}
                            >
                                <h3 className="font-bold">{chat.name}</h3>
                                <p className="text-sm text-gray-600">{chat.message}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-3/4 flex flex-col bg-white">
                    {selectedChat ? (
                        <>
                            <div className="p-4 border-b flex justify-between items-center">
                                <h3 className="font-bold text-lg">{selectedChat.name}</h3>
                                <BsThreeDots className="text-xl cursor-pointer" />
                            </div>
                            <div className="flex-1 p-4 overflow-y-auto">
                                <p className="bg-gray-200 p-2 rounded-lg w-fit mb-2">{selectedChat.message}</p>
                            </div>
                            <div className="p-4 flex items-center border-t">
                                <FaRegSmile className="text-2xl cursor-pointer mr-3" />
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Nhập tin nhắn..."
                                    className="flex-1 p-2 border rounded-lg"
                                />
                                <IoMdSend className="text-2xl cursor-pointer ml-3 text-blue-500" />
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            Chọn một cuộc trò chuyện để bắt đầu
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Messaging;
