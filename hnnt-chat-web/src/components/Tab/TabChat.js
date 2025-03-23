import PopupCategoryAndState from '../Popup/PopupCategoryAndState';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveChat, setSeemChat } from '../../redux/slices/chatSlice';
import { MdOutlineGifBox } from 'react-icons/md';
import { LuSticker } from 'react-icons/lu';
import { IoImageOutline } from 'react-icons/io5';
import { MdFilePresent } from 'react-icons/md';
import { MdLabel } from 'react-icons/md';
import { HiBellSlash } from 'react-icons/hi2';
import { TiPin } from 'react-icons/ti';

import { setActiveTabMessToOrther, setActiveTabMessToPriority } from '../../redux/slices/chatSlice';
import { useEffect, useRef, useState } from 'react';
import PopupMenuForMess from '../Popup/PopupMenuForMess';
import { FiMoreHorizontal } from 'react-icons/fi';
import { formatDistanceToNow, format } from 'date-fns';
import { vi } from 'date-fns/locale';

import { getChat } from '../../screens/Messaging/api';

function TabChat() {
    const userActive = useSelector((state) => state.auth.userActive);
    const userId = userActive?.id;
    const activeTab = useSelector((state) => state.chat.activeTabMess);
    const activeChat = useSelector((state) => state.chat.activeChat);
    const [hoveredMessage, setHoveredMessage] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const categories = useSelector((state) => state.category.currentCategory) || [];
    const state = useSelector((state) => state.category.state);
    // const data = useSelector((state) => state.chat.data);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const chats = await getChat();
                setData(chats);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchChats(); // Gọi hàm async bên trong useEffect
    }, [data]);
    const dispatch = useDispatch();
    const priorityChatsList = data.filter(
        (chat) =>
            chat.priority &&
            (categories.length === 0 || categories?.some((cat) => cat.id === chat.category.id)) &&
            (!chat.isGroup || chat.members?.some((m) => m?.id === userActive?.id)) &&
            (state !== 'Chưa đọc' || chat.seem === false),
    );
    const otherChatsList = data.filter(
        (chat) =>
            !chat.priority &&
            (categories.length === 0 || categories?.some((cat) => cat.id === chat.category.id)) &&
            (!chat.isGroup || chat.members?.some((m) => m?.id === userActive?.id)) &&
            (state !== 'Chưa đọc' || chat.seem === false),
    );

    const chats = activeTab === 'priority' ? priorityChatsList : otherChatsList;

    // const getLastMessage = (messages) => {
    //     const filteredMessages = messages.filter((msg) => !msg.delete.some((m) => m.id === userId) && !msg.destroy);
    //     return filteredMessages.length > 0 ? filteredMessages.at(-1) : null;
    // };
    const timeoutRef = useRef(null);

    const formatTime = (time) => {
        const date = new Date(time);
        const now = new Date();

        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            return formatDistanceToNow(date, { addSuffix: true, locale: vi }); // "2 phút trước", "1 giờ trước"
        } else if (diffInDays === 1) {
            return 'Hôm qua';
        } else {
            return format(date, 'dd/MM/yyyy', { locale: vi }); // Hiển thị ngày gửi
        }
    };

    return (
        <div className="">
            <div className="flex border-b dark:border-b-black justify-between p-4 pt-0 pb-0">
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
            <div className="overflow-y-auto min-h-[500px] z-0">
                {data
                    .sort((a, b) => {
                        const pinA = a.participants.find((p) => p.accountId === userId)?.pin || false;
                        const pinB = b.participants.find((p) => p.accountId === userId)?.pin || false;
                        return Number(pinB) - Number(pinA);
                    })
                    .map((chat, index) => {
                        const notMe = chat.participants?.find((user) => user.accountId !== userId)?.account;
                        const me = chat.participants?.find((user) => user.accountId === userId);
                        const deleteByMeOrDestroy =
                            chat.messages[0]?.deletedBy.some((m) => m === userId) || chat.messages[0]?.destroy;

                        return (
                            <div
                                key={chat.id}
                                className={`relative p-3 cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700 dark:text-gray-300 ${
                                    activeChat?.id === chat.id ? 'bg-blue-100 dark:bg-[#20344c]' : ''
                                }`}
                                onClick={() => {
                                    dispatch(setActiveChat(chat));
                                    dispatch(setSeemChat({ chatId: chat.id, seem: true }));
                                }}
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
                                <div>
                                    <div className="absolute top-[5px] right-[0px] flex">
                                        {!me?.notify && <HiBellSlash size={13} className="m-1 text-gray-500" />}
                                        {me?.pin && <TiPin size={13} className="m-1 text-gray-500" />}
                                        {hoveredMessage === index && (
                                            <div className="relative ">
                                                <FiMoreHorizontal
                                                    size={13}
                                                    className="m-1 mr-2 text-gray-500 hover:bg-blue-200 rounded-[2px]"
                                                    onClick={() => setShowPopup(true)}
                                                />
                                                {showPopup && hoveredMessage === index && (
                                                    <PopupMenuForMess
                                                        setShowPopup={setShowPopup}
                                                        setHoveredMessage={setHoveredMessage}
                                                        chat={me}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-[15px] right-[10px] flex  text-[10px]">
                                        {chat?.messages[0]?.time && formatTime(chat?.messages[0]?.time)}
                                    </div>
                                </div>

                                <div className="flex item-center">
                                    <img
                                        src={chat.isGroup ? chat.avatar : notMe.avatar} // Thay bằng avatar thật
                                        alt="avatar"
                                        className="w-[45px] h-[45px] rounded-full border mr-3 object-cover"
                                    />
                                    <div>
                                        <h3 className="font-medium text-xs text-lg mt-1 max-w-[270px] truncate dark:text-white">
                                            {chat.isGroup ? chat.name : notMe.name || 'Người dùng'}
                                        </h3>
                                        <p
                                            className={`flex items-center text-sm  text-xs mt-1  ${
                                                chat.seem
                                                    ? 'text-gray-600 dark:text-gray-400'
                                                    : 'font-medium text-black dark:text-white'
                                            }`}
                                        >
                                            {chat.category?.name && (
                                                <MdLabel className={`text-[18px] mr-1 ${chat.category?.color}`} />
                                            )}
                                            {chat?.messages[0]?.senderId === userId ? (
                                                <span className="mr-1">Bạn: </span>
                                            ) : (
                                                <span className="mr-1">{chat?.messages[0]?.sender.name}:</span>
                                            )}
                                            {deleteByMeOrDestroy ? (
                                                <span className="max-w-[220px] truncate italic">
                                                    Tin nhắn đã bị xóa
                                                </span>
                                            ) : (
                                                <>
                                                    {chat?.messages[0]?.type === 'gif' ? (
                                                        <span className="flex items-center">
                                                            <MdOutlineGifBox size={15} className="mr-[4px]" /> [GIF]
                                                        </span>
                                                    ) : chat?.messages[0]?.type === 'sticker' ? (
                                                        <span className="flex items-center">
                                                            <LuSticker size={15} className="mr-[4px]" /> [Sticker]
                                                        </span>
                                                    ) : chat?.messages[0]?.type === 'image' ? (
                                                        <span className="flex items-center">
                                                            <IoImageOutline size={15} className="mr-[4px]" />
                                                            [Hình ảnh]
                                                        </span>
                                                    ) : chat?.messages[0]?.type === 'file' ? (
                                                        <span className="flex items-center">
                                                            <MdFilePresent size={15} className="mr-[4px]" />{' '}
                                                            {chat?.messages[0]?.fileName}
                                                        </span>
                                                    ) : chat?.messages[0]?.type === 'text' ? (
                                                        <span className="max-w-[160px] truncate">
                                                            {chat?.messages[0].content}
                                                        </span>
                                                    ) : (
                                                        <span className="max-w-[220px] truncate italic">
                                                            Hãy bắt đầu trò chuyện
                                                        </span>
                                                    )}
                                                </>
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

export default TabChat;
