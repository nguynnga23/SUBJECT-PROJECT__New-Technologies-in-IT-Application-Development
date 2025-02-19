import PopupCategoryAndState from '../../components/Popup/PopupCategoryAndState';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveChat } from '../../redux/slices/chatSlice';
import { MdOutlineGifBox } from 'react-icons/md';
import { LuSticker } from 'react-icons/lu';
import { IoImageOutline } from 'react-icons/io5';
import { MdFilePresent } from 'react-icons/md';
import { MdLabel } from 'react-icons/md';
import { HiBellSlash } from 'react-icons/hi2';
import { TiPin } from 'react-icons/ti';

import { setActiveTabMessToOrther, setActiveTabMessToPriority } from '../../redux/slices/chatSlice';
import { useRef, useState } from 'react';
import PopupMenuForMess from '../Popup/PopupMenuForMess';
import { FiMoreHorizontal } from 'react-icons/fi';
import userActive from '../../sample_data/userActive';

function TabMesssage() {
    const userId = userActive.id;
    const activeTab = useSelector((state) => state.chat.activeTabMess);
    const activeChat = useSelector((state) => state.chat.activeChat);
    const data = useSelector((state) => state.chat.data);
    const [hoveredMessage, setHoveredMessage] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const dispatch = useDispatch();

    const priorityChatsList = data.filter((chat) => chat.kind === 'priority');
    const otherChatsList = data.filter((chat) => chat.kind === 'other');
    const chats = activeTab === 'priority' ? priorityChatsList : otherChatsList;

    const getLastMessage = (messages) => {
        const filteredMessages = messages.filter((msg) => !msg.delete.some((m) => m.id === userId) && !msg.destroy);
        return filteredMessages.length > 0 ? filteredMessages.at(-1) : null;
    };
    const timeoutRef = useRef(null);

    return (
        <div className="">
            <div className="flex border-b justify-between p-4 pt-0 pb-0">
                <div>
                    <button
                        className={`flex-1 py-2 mr-3 pt-4 text-xs text-center font-medium ${
                            activeTab === 'priority' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                        }`}
                        onClick={() => dispatch(setActiveTabMessToPriority())}
                    >
                        Ưu tiên
                    </button>
                    <button
                        className={`flex-1 py-2 pt-4 text-xs text-center font-medium ${
                            activeTab === 'other' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                        }`}
                        onClick={() => dispatch(setActiveTabMessToOrther())}
                    >
                        Khác
                    </button>
                </div>
                <PopupCategoryAndState />
            </div>
            <div className="overflow-y-auto h-[calc(100vh_-_100px)] z-0">
                {chats
                    .filter((chat) => !chat.delete.some((item) => item.id === userId))
                    .sort((a, b) => (b.pin ? 1 : 0) - (a.pin ? 1 : 0))
                    .map((chat, index) => {
                        const lastMessage = getLastMessage(chat.messages);
                        return (
                            <div
                                key={chat.id}
                                className={`relative p-3 cursor-pointer hover:bg-gray-200 ${
                                    activeChat?.id === chat.id ? 'bg-blue-100' : ''
                                }`}
                                onClick={() => dispatch(setActiveChat(chat))}
                                onMouseEnter={() => {
                                    if (timeoutRef.current) {
                                        // Hủy bỏ timeout nếu chuột quay lại
                                        clearTimeout(timeoutRef.current);
                                        !showPopup && setHoveredMessage(index);
                                    }
                                }}
                                onMouseLeave={() => {
                                    timeoutRef.current = setTimeout(() => {
                                        setHoveredMessage(null);
                                        setShowPopup(false);
                                    }, 500);
                                }}
                            >
                                <div className="absolute top-[5px] right-[0px]">
                                    {hoveredMessage === index ? (
                                        <div className="relative ">
                                            <FiMoreHorizontal
                                                size={13}
                                                className="m-2 text-gray-500 hover:bg-blue-200 rounded-[2px]"
                                                onClick={() => setShowPopup(true)}
                                            />
                                            {showPopup && hoveredMessage === index && (
                                                <PopupMenuForMess
                                                    setShowPopup={setShowPopup}
                                                    setHoveredMessage={setHoveredMessage}
                                                    chat={chat}
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        !chat.notify && <HiBellSlash size={13} className="m-2 text-gray-500" />
                                    )}
                                    {chat.pin && <TiPin size={13} className="m-2 text-gray-500" />}
                                </div>

                                <div className="flex item-center">
                                    <img
                                        src={chat.avatar} // Thay bằng avatar thật
                                        className="w-[45px] h-[45px] rounded-full border mr-3 object-cover"
                                    />
                                    <div>
                                        <h3 className="font-medium text-xs text-lg mt-1 max-w-[270px] truncate">
                                            {chat.name}
                                        </h3>
                                        <p className="flex items-center text-sm text-gray-600 text-xs mt-1 ">
                                            {chat.category.name && (
                                                <MdLabel className={`text-[18px] mr-1 ${chat.categoryColor}`} />
                                            )}
                                            {lastMessage?.sender === userId ? (
                                                <span className="mr-1">You: </span>
                                            ) : (
                                                lastMessage?.sender && <span className="mr-1">{chat.name}:</span>
                                            )}
                                            {lastMessage?.type === 'gif' ? (
                                                <span className="flex items-center">
                                                    <MdOutlineGifBox size={15} className="mr-[4px]" /> [GIF]
                                                </span>
                                            ) : lastMessage?.type === 'sticker' ? (
                                                <span className="flex items-center">
                                                    <LuSticker size={15} className="mr-[4px]" /> [Sticker]
                                                </span>
                                            ) : lastMessage?.type === 'image' ? (
                                                <span className="flex items-center">
                                                    <IoImageOutline size={15} className="mr-[4px]" />
                                                    [Hình ảnh]
                                                </span>
                                            ) : lastMessage?.type === 'file' ? (
                                                <span className="flex items-center">
                                                    <MdFilePresent size={15} className="mr-[4px]" />{' '}
                                                    {lastMessage?.fileName}
                                                </span>
                                            ) : lastMessage?.content ? (
                                                <span className="max-w-[220px] truncate">{lastMessage?.content}</span>
                                            ) : (
                                                <span className="max-w-[220px] truncate italic">
                                                    Hãy bắt đầu trò chuyện
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

export default TabMesssage;
