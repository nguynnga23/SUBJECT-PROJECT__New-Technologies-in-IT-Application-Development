import { useState } from 'react';
import { FaSearch, FaRegSmile } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { BsThreeDots } from 'react-icons/bs';
import { RiUserAddLine } from 'react-icons/ri';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';

const chats = [
    { id: 1, name: 'Nguyen Van A', message: 'Xin chào!', time: '10:00 AM' },
    { id: 2, name: 'Tran Thi B', message: 'Hôm nay bạn thế nào?', time: '11:15 AM' },
    { id: 3, name: 'Le Van C', message: 'Hẹn gặp bạn sau!', time: '1:30 PM' },
];

function Messaging() {
    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState('');

    return (
        <div className="h-screen flex flex-col">
            <div className="flex-1 flex min-h-0">
                <div className="w-1/4 bg-white border-r p-4">
                    <div className="flex justify-between items-center pb-4 border-b relative my-4">
                        <input type="text" placeholder="Tìm kiếm..." className="w-full pl-10 p-2 border rounded-lg" />
                        <FaSearch className="absolute left-3 top-3 text-gray-500" />
                        <div className="pl-2">
                            <RiUserAddLine size={24} />
                        </div>
                        <div className="pl-2">
                            <AiOutlineUsergroupAdd size={24} />
                        </div>
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
