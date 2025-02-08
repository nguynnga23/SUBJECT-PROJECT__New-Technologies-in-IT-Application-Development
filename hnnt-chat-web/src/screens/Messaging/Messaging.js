import { useState } from 'react';
import { FaSearch, FaRegSmile } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { BsThreeDots } from 'react-icons/bs';
import { RiUserAddLine } from 'react-icons/ri';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';

import PopupCategoryAndState from '../../components/Popup/PopupCategoryAndState';
import PopupAddFriend from '../../components/Popup/PopupAddFriend';

const priorityChats = [
    { id: 1, name: 'Nguyen Van A', message: 'Xin chào!', time: '10:00 AM' },
    { id: 2, name: 'Tran Thi B', message: 'Hôm nay bạn thế nào?', time: '11:15 AM' },
];

const otherChats = [{ id: 3, name: 'Le Van C', message: 'Hẹn gặp bạn sau!', time: '1:30 PM' }];

function Messaging() {
    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('priority');
    const [addFriendButton, setAddFriendButton] = useState(false);

    const chats = activeTab === 'priority' ? priorityChats : otherChats;

    return (
        <div className="h-screen flex flex-col">
            <div className="flex-1 flex min-h-0 ">
                <div className="w-1/4 min-w-[360px] bg-white border-r p-4">
                    <div className="flex justify-between items-center  relative ">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="w-full pl-8 p-1.5 border rounded-lg text-xs focus:border-blue-500 focus:outline-none"
                        />
                        <FaSearch className="absolute left-3 top-2 text-gray-500 text-xs" />
                        <div className="pl-2">
                            <RiUserAddLine size={20} onClick={() => setAddFriendButton(true)} />
                            <PopupAddFriend isOpen={addFriendButton} onClose={() => setAddFriendButton(false)} />
                        </div>
                        <div className="pl-2">
                            <AiOutlineUsergroupAdd size={20} />
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
