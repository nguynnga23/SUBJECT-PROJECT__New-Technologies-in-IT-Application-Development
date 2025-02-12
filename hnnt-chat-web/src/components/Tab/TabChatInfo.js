import { FaTrashAlt } from 'react-icons/fa';
import { GoBell } from 'react-icons/go';
import { GrPin } from 'react-icons/gr';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { GoBellSlash } from 'react-icons/go';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosArrowDropdown } from 'react-icons/io';
import { IoIosArrowDropright } from 'react-icons/io';

import { setOnOrOfPin, setOnOrOfNotify } from '../../redux/slices/chatSlice';
import { useState } from 'react';

function TabChatInfo() {
    const activeChat = useSelector((state) => state.chat.chats.find((chat) => chat.id === state.chat.activeChat?.id));

    const [fileOpen, setFileOpen] = useState(false);
    const [imageOpen, setImageOpen] = useState(false);
    const [linkOpen, setLinkOpen] = useState(false);

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
                                onClick={() => dispatch(setOnOrOfNotify())}
                            />
                        ) : (
                            <GoBellSlash
                                size={35}
                                className="p-2 bg-gray-200 rounded-full cursor-pointer text-blue-500"
                                onClick={() => dispatch(setOnOrOfNotify())}
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
                                onClick={() => dispatch(setOnOrOfPin())}
                            />
                        ) : (
                            <GrPin
                                size={35}
                                className="p-2 bg-gray-200 rounded-full cursor-pointer text-blue-500"
                                onClick={() => dispatch(setOnOrOfPin())}
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
                <div className="p-2 border-b-[7px] cursor-pointer ">
                    <div className="flex justify-between items-center pl-2" onClick={() => setImageOpen(!imageOpen)}>
                        <span className=" font-medium cursor-pointer text-base ">Ảnh</span>
                        {imageOpen ? (
                            <IoIosArrowDropdown className=" font-medium text-base text-gray-400" />
                        ) : (
                            <IoIosArrowDropright className=" font-medium text-base text-gray-400" />
                        )}
                    </div>
                    {imageOpen && (
                        <div className="flex flex-wrap p-1 gap-2">
                            {activeChat.messages
                                .filter((msg) => msg.type === 'image')
                                .map((msg) => (
                                    <img
                                        src={msg.content}
                                        className="w-[75px] h-[75px] rounded-lg object-cover border"
                                    />
                                ))}
                        </div>
                    )}
                </div>
                <div className="p-2 border-b-[7px]">
                    <div className="flex justify-between items-center pl-2" onClick={() => setFileOpen(!fileOpen)}>
                        <span className=" font-medium cursor-pointer text-base ">File</span>
                        {fileOpen ? (
                            <IoIosArrowDropdown className=" font-medium text-base text-gray-400" />
                        ) : (
                            <IoIosArrowDropright className=" font-medium text-base text-gray-400" />
                        )}
                    </div>
                    {fileOpen && (
                        <div className="flex flex-wrap p-1 gap-2">
                            {activeChat.messages
                                .filter((msg) => msg.type === 'file')
                                .map((msg) => (
                                    <img
                                        src={msg.content}
                                        className="w-[75px] h-[75px] rounded-lg object-cover border"
                                    />
                                ))}
                        </div>
                    )}
                </div>
                <div className="items-center p-2 border-b-[7px] cursor-pointer cursor-pointer">
                    <div className="flex justify-between items-center pl-2" onClick={() => setLinkOpen(!linkOpen)}>
                        <span className=" font-medium cursor-pointer text-base ">Link</span>
                        {linkOpen ? (
                            <IoIosArrowDropdown className=" font-medium text-base text-gray-400" />
                        ) : (
                            <IoIosArrowDropright className=" font-medium text-base text-gray-400" />
                        )}
                    </div>
                    {linkOpen && (
                        <div className="flex flex-wrap p-1 gap-2">
                            {activeChat.messages
                                .filter((msg) => msg.type === 'link')
                                .map((msg) => (
                                    <img
                                        src={msg.content}
                                        className="w-[75px] h-[75px] rounded-lg object-cover border"
                                    />
                                ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Xóa lịch sử trò chuyện */}
            <div className="text-red-500 flex items-center space-x-2 py-3 font-medium cursor-pointer text-base pl-2">
                <FaTrashAlt />
                <span className="text-[12px]">Xóa lịch sử trò chuyện</span>
            </div>
        </div>
    );
}

export default TabChatInfo;
