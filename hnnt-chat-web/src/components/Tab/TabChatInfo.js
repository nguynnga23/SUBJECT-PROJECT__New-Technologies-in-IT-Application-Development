import { FaTrashAlt } from 'react-icons/fa';
import { GoBell } from 'react-icons/go';
import { GrPin } from 'react-icons/gr';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { GoBellSlash } from 'react-icons/go';
import { useDispatch, useSelector } from 'react-redux';

import { setOnOrOfPin, setOnOrOfNotify, deleteChatForUser } from '../../redux/slices/chatSlice';
import { useState } from 'react';
import Archive from '../Archive/Archive';

function TabChatInfo() {
    const userId = 0;
    const activeChat = useSelector((state) => state.chat.chats.find((chat) => chat.id === state.chat.activeChat?.id));
    const chatId = activeChat.id;

    const [fileOpen, setFileOpen] = useState(true);
    const [imageOpen, setImageOpen] = useState(true);
    const [linkOpen, setLinkOpen] = useState(true);

    const dispatch = useDispatch();

    return (
        <div className="overflow-auto">
            {/* Avatar + Tên nhóm */}
            <div className="flex flex-col items-center p-3">
                <img src={activeChat.avatar} className="w-[55px] h-[55px] rounded-full border object-cover" />
                <h3 className="font-bold text-lg mt-2 font-medium">{activeChat.name}</h3>
            </div>
            <div className="flex item-center justify-center border-b-[7px]">
                <div className="m-4 mt-1 w-[50px] text-center">
                    <div className="flex justify-center">
                        {activeChat.notify ? (
                            <GoBell
                                size={35}
                                className="p-2 bg-gray-200 rounded-full cursor-pointer"
                                onClick={() => dispatch(setOnOrOfNotify(activeChat.id))}
                            />
                        ) : (
                            <GoBellSlash
                                size={35}
                                className="p-2 bg-gray-200 rounded-full cursor-pointer text-blue-500"
                                onClick={() => dispatch(setOnOrOfNotify(activeChat.id))}
                            />
                        )}
                    </div>
                    <p className="text-[10px]"> {activeChat.notify ? 'Tắt thông báo' : 'Bật thông báo'}</p>
                </div>
                <div className="m-4 mt-1 w-[50px] text-center">
                    <div className="flex justify-center">
                        {!activeChat.pin ? (
                            <GrPin
                                size={35}
                                className="p-2 bg-gray-200 rounded-full cursor-pointer"
                                onClick={() => dispatch(setOnOrOfPin(activeChat.id))}
                            />
                        ) : (
                            <GrPin
                                size={35}
                                className="p-2 bg-gray-200 rounded-full cursor-pointer text-blue-500"
                                onClick={() => dispatch(setOnOrOfPin(activeChat.id))}
                            />
                        )}
                    </div>
                    <p className="text-[10px]"> {!activeChat.pin ? 'Ghim hội thoại' : 'Bỏ ghim hội thoại'}</p>
                </div>
                <div className="m-4 mt-1 w-[50px] text-center">
                    <div className="flex justify-center">
                        <AiOutlineUsergroupAdd size={35} className="p-2 bg-gray-200  rounded-full cursor-pointer" />
                    </div>
                    <p className="text-[10px]">Tạo nhóm trò chuyện</p>
                </div>
            </div>

            {/* Danh mục */}
            <div className="space-y-2 ">
                <Archive
                    title="Ảnh"
                    isOpen={imageOpen}
                    toggleOpen={() => setImageOpen(!imageOpen)}
                    messages={activeChat.messages}
                    type="image"
                />
                <Archive
                    title="File"
                    isOpen={fileOpen}
                    toggleOpen={() => setFileOpen(!fileOpen)}
                    messages={activeChat.messages}
                    type="file"
                />
                <Archive
                    title="Link"
                    isOpen={linkOpen}
                    toggleOpen={() => setLinkOpen(!linkOpen)}
                    messages={activeChat.messages}
                    type="link"
                />
            </div>

            {/* Xóa lịch sử trò chuyện */}
            <div className="text-red-500 flex items-center space-x-2 py-3 font-medium cursor-pointer text-base pl-2">
                <FaTrashAlt />
                <span className="text-[12px]" onClick={() => dispatch(deleteChatForUser({ userId, chatId }))}>
                    Xóa lịch sử trò chuyện
                </span>
            </div>
        </div>
    );
}

export default TabChatInfo;
