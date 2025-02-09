import { useState } from 'react';
import { IoMdSend } from 'react-icons/io';
import { BsThreeDots } from 'react-icons/bs';
import { FaRegSmile } from 'react-icons/fa';
import { MdLabelOutline } from 'react-icons/md';

function TabChat({ selectedChat, showRightBar, setShowRightBar }) {
    const [message, setMessage] = useState('');

    return (
        <>
            <div className="p-2 border-b flex justify-between items-center">
                <div className="flex justify-center">
                    <img
                        src={selectedChat.avatar} // Thay bằng avatar thật
                        className="w-[45px] h-[45px] rounded-full border mr-2 object-cover"
                    />
                    <div>
                        <h3 className="font-medium text-base text-lg">{selectedChat.name}</h3>
                        <MdLabelOutline color="gray" />
                    </div>
                </div>

                <BsThreeDots className="text-xl cursor-pointer" onClick={() => setShowRightBar(!showRightBar)} />
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
    );
}

export default TabChat;
