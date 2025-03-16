import { useState, useRef, useEffect } from 'react';
import { IoMdSend } from 'react-icons/io';
import { MdLabelOutline } from 'react-icons/md';
import { VscLayoutSidebarRightOff } from 'react-icons/vsc';
import { VscLayoutSidebarRight } from 'react-icons/vsc';
import { BsTelephone } from 'react-icons/bs';
import { GoDeviceCameraVideo } from 'react-icons/go';
import { IoSearchOutline } from 'react-icons/io5';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { IoImageOutline } from 'react-icons/io5';
import { MdAttachFile } from 'react-icons/md';
import { FaRegAddressCard } from 'react-icons/fa6';
import { MdOutlineEmojiEmotions } from 'react-icons/md';
import { LuSticker } from 'react-icons/lu';
import { MdLabel } from 'react-icons/md';
import { CiUser } from 'react-icons/ci';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { MdOutlineReply } from 'react-icons/md';
import { CiCircleRemove } from 'react-icons/ci';
import { MdFilePresent } from 'react-icons/md';
import { VscFilePdf } from 'react-icons/vsc';
import { FaRegFileWord } from 'react-icons/fa';
import { FaRegFileExcel } from 'react-icons/fa';
import { FaRegFilePowerpoint } from 'react-icons/fa';

import PopupCategory from '../Popup/PopupCategory';

import { useDispatch, useSelector } from 'react-redux';
import {
    setShowOrOffRightBar,
    setShowOrOffRightBarSearch,
    openEmojiTab,
    sendEmoji,
} from '../../redux/slices/chatSlice';
import ChatText from '../Chat/ChatText';
import ChatGif from '../Chat/ChatGif';
import ChatImage from '../Chat/ChatImage';
import ChatFile from '../Chat/ChatFile';
import ChatDestroy from '../Chat/ChatDestroy';
import ChatSticker from '../Chat/ChatSticker';
import PopupAddGroup from '../Popup/PopupAddGroup';
import PopupVideoCall from '../Popup/PopupVideoCall';
import { FiMoreHorizontal } from 'react-icons/fi';
import PopupReacttion from '../Popup/PopupReaction';
import PopupReactionChat from '../Popup/PopupReactionChat';
import PopupMenuForChat from '../Popup/PopupMenuForChat';
import { getMessage, sendMessage } from '../../screens/Messaging/api';

function TabMessage() {
    const [message, setMessage] = useState('');
    const [isOpenCategory, setIsOpenCategory] = useState(false);
    const userActive = useSelector((state) => state.auth.userActive);
    const userId = userActive.id;

    const activeChat = useSelector((state) => state.chat.activeChat);
    const chatId = activeChat.id;

    const dispatch = useDispatch();
    const showRightBar = useSelector((state) => state.chat.showRightBar);
    const showRightBarSearch = useSelector((state) => state.chat.showRightBarSearch);
    const emojiObject = useSelector((state) => state.chat.emojiObject);
    const textareaRef = useRef(null);
    const inputImageRef = useRef(null); // Tạo tham chiếu đến input image
    const inputFileRef = useRef(null); // Tạo tham chiếu đến input image
    const chatContainerRef = useRef(null);
    const [hoveredMessage, setHoveredMessage] = useState(null);
    const [isPopupOpenIndex, setIsPopupOpenIndex] = useState(null);

    const [addGroupButton, setAddGroupButton] = useState(false);

    const [videoCall, setVideoCall] = useState(false);
    const [showPopupReaction, setShowPopupReaction] = useState(false);
    const [openReactionChat, setOpenReactionChat] = useState(false);

    const [replyMessage, setReplyMessage] = useState(null);

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const chats = await getMessage(chatId);
                setData(chats);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchMessages(); // Gọi hàm async bên trong useEffect
    }, [chatId, data]);

    const MessageComponent = {
        text: ChatText,
        gif: ChatGif,
        image: ChatImage,
        file: ChatFile,
        sticker: ChatSticker,
    };

    const getFileIcon = (fileType) => {
        if (fileType.includes('pdf')) return <VscFilePdf className="text-3xl text-red-500 mr-2" />;
        if (fileType.includes('excel') || fileType.includes('spreadsheet') || fileType.includes('xls'))
            return <FaRegFileExcel className="text-3xl text-green-600 mr-2" />;
        if (fileType.includes('powerpoint') || fileType.includes('presentation') || fileType.includes('ppt'))
            return <FaRegFilePowerpoint className="text-3xl text-orange-500 mr-2" />;
        if (fileType.includes('word') || fileType.includes('msword') || fileType.includes('document'))
            return <FaRegFileWord className="text-3xl text-blue-600 mr-2" />;
        return <MdFilePresent className="text-3xl text-gray-500 mr-2" />; // Mặc định
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [activeChat?.id]);

    // Hàm tự động điều chỉnh chiều cao
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = '30px'; // Reset chiều cao trước khi tính toán
            const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
            textareaRef.current.style.height = `${newHeight}px`;
        }
    }, [message]);

    const handleSendMessage = async () => {
        if (message.trim() !== '') {
            await sendMessage(chatId, message, 'text');
            setMessage('');
            setReplyMessage(null);
        }
        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, 100);
    };

    useEffect(() => {
        if (emojiObject != null) {
            setMessage((prev) => prev + emojiObject.emoji);
        }
        dispatch(sendEmoji(null));
    }, [emojiObject, dispatch]);

    const handleFileChange = (event, type) => {
        const file = event.target.files[0];
        if (file) {
            const currentTime = new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            });

            dispatch(
                sendMessage({
                    chatId: activeChat.id,
                    content: URL.createObjectURL(file),
                    fileName: file.name, // Lấy tên file
                    fileSize: (file.size / 1024).toFixed(2) + ' KB',
                    fileType: file.type,
                    time: currentTime,
                    type: type,
                    reply: replyMessage,
                }),
            );
        }
        event.target.value = '';
        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, 100);
    };

    return (
        <>
            <div className="p-2 border-b dark:border-b-black flex justify-between items-center h-[62px] min-w-[600px] dark:bg-gray-800">
                <div className="flex justify-center ">
                    <img
                        src={
                            activeChat?.isGroup
                                ? activeChat?.avatar
                                : activeChat?.participants?.find((user) => user.accountId !== userId)?.account.avatar
                        } // Thay bằng avatar thật
                        alt="avatar"
                        className="w-[45px] h-[45px] rounded-full border mr-2 object-cover"
                    />
                    <div>
                        <h3 className="font-medium text-base text-lg max-h-[28px] dark:text-gray-300">
                            {activeChat?.isGroup
                                ? activeChat?.name
                                : activeChat?.participants?.find((user) => user.accountId !== userId)?.account?.name ||
                                  'Người dùng'}
                        </h3>
                        <div className="flex items-center">
                            {activeChat?.members && (
                                <div className="flex text-[14px] text-gray-600 items-center dark:text-gray-300">
                                    <CiUser className={`cursor-pointer mr-1`} />
                                    <p className="text-[10px] mr-1">{activeChat?.members.length} thành viên |</p>
                                </div>
                            )}
                            {activeChat?.category?.name ? (
                                <div className="flex items-center">
                                    <MdLabel
                                        className={`cursor-pointer mr-1 ${activeChat?.category.color}`}
                                        onClick={() => setIsOpenCategory(!isOpenCategory)}
                                    />
                                    <p className="text-[10px] dark:text-gray-300">{activeChat?.category?.name}</p>
                                </div>
                            ) : (
                                <MdLabelOutline
                                    className={`cursor-pointer text-gray-400`}
                                    onClick={() => setIsOpenCategory(!isOpenCategory)}
                                />
                            )}
                        </div>
                    </div>
                    {isOpenCategory && <PopupCategory isOpen={isOpenCategory} setIsOpen={setIsOpenCategory} />}
                </div>
                <div className="p-2 flex dark:text-gray-300">
                    {activeChat?.isGroup ? (
                        <div className="flex items-center">
                            <AiOutlineUsergroupAdd
                                size={26}
                                onClick={() => setAddGroupButton(true)}
                                className="ml-1.5 p-1 hover:text-gray-500 hover:bg-gray-200  hover:rounded-[5px] cursor-pointer"
                            />
                            <PopupAddGroup
                                isOpen={addGroupButton}
                                onClose={() => setAddGroupButton(false)}
                                activeChat={activeChat}
                            />
                        </div>
                    ) : (
                        <BsTelephone
                            size={26}
                            className="ml-1.5 p-1 hover:text-gray-500 hover:bg-gray-200  hover:rounded-[5px] cursor-pointer"
                            onClick={() => setVideoCall(true)}
                        />
                    )}
                    <GoDeviceCameraVideo
                        size={26}
                        className="ml-1.5 p-1 hover:text-gray-500 hover:bg-gray-200  hover:rounded-[5px] cursor-pointer"
                        onClick={() => setVideoCall(true)}
                    />
                    <IoSearchOutline
                        size={26}
                        className={`ml-1.5 p-1 hover:text-gray-500 hover:bg-gray-200  hover:rounded-[5px] cursor-pointer ${
                            showRightBarSearch ? 'text-blue-500 bg-blue-200 rounded-[5px]' : ''
                        }`}
                        onClick={() => dispatch(setShowOrOffRightBarSearch(!showRightBarSearch))}
                    />

                    {showRightBar ? (
                        <VscLayoutSidebarRight
                            size={26}
                            className="ml-1.5 text-blue-500 bg-blue-200 p-1 rounded-[5px] cursor-pointer"
                            onClick={() => dispatch(setShowOrOffRightBar(!showRightBar))}
                        />
                    ) : (
                        <VscLayoutSidebarRightOff
                            size={26}
                            className="ml-1.5 p-1 hover:text-gray-500 hover:rounded-[5px] hover:bg-gray-200 cursor-pointer"
                            onClick={() => dispatch(setShowOrOffRightBar(!showRightBar))}
                        />
                    )}

                    {videoCall && (
                        <PopupVideoCall setVideoCall={setVideoCall} activeChat={activeChat} userActive={userActive} />
                    )}
                </div>
            </div>
            <div className="flex-1 p-5 overflow-auto bg-gray-200 dark:bg-[#16191d]" ref={chatContainerRef}>
                {data.map((message, index) => {
                    const isDeleted = message.deletedBy.some((item) => item.id === userId);
                    const Component = message.destroy ? ChatDestroy : MessageComponent[message.type];
                    // Kiểm tra nếu tin nhắn trước đó bị xóa hoặc có sender khác
                    const prevMessage = activeChat?.messages[index - 1];
                    const prevMessageDeleted = prevMessage?.delete?.some((item) => item.id === userId);
                    const showAvatar =
                        index === 0 ||
                        !prevMessage ||
                        prevMessage.sender.id !== message.sender.id ||
                        prevMessageDeleted;
                    const position = message.sender.id === userId ? 'right' : 'left';
                    const sumReaction = message.reactions.reduce((total, reaction) => total + reaction.sum, 0);

                    return (
                        <div
                            className={`relative flex ${
                                message.sender.id === userId ? 'justify-end' : 'justify-start'
                            }`}
                            key={index}
                            onMouseEnter={() => {
                                if (isPopupOpenIndex === null) setHoveredMessage(index);
                                setOpenReactionChat(false);
                            }}
                            onMouseLeave={() => {
                                if (isPopupOpenIndex === null) setHoveredMessage(null);
                                setOpenReactionChat(false);
                            }}
                        >
                            {!isDeleted && Component && (
                                <div className="flex ">
                                    <div className="w-[45px] h-[45px] mr-3 flex-shrink-0">
                                        {message.sender.id !== userId && showAvatar && (
                                            <img
                                                src={message.sender.avatar}
                                                alt="avatar"
                                                className="w-full h-full rounded-full border object-cover"
                                            />
                                        )}
                                    </div>

                                    <div className="flex relative ">
                                        {hoveredMessage === index &&
                                            isPopupOpenIndex === null &&
                                            message.sender.id === userActive.id && (
                                                <div className="flex">
                                                    <button
                                                        className={`absolute left-[-25px] bottom-[30px] dark:bg-gray-700  p-1 rounded-full hover:bg-gray-300 hover:text-blue-500 mr-1 hover:dark:bg-blue-300 hover:dark:text-gray-100`}
                                                        onClick={() => {
                                                            setIsPopupOpenIndex(index);
                                                        }}
                                                    >
                                                        <FiMoreHorizontal size={15} />
                                                    </button>
                                                    {!message.destroy && (
                                                        <button
                                                            className={`absolute left-[-50px] bottom-[30px] dark:bg-gray-700  p-1 rounded-full hover:bg-gray-300 hover:text-blue-500 hover:dark:bg-blue-300 hover:dark:text-gray-100`}
                                                            onClick={() => {
                                                                setReplyMessage(message);
                                                            }}
                                                        >
                                                            <MdOutlineReply size={15} />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        <div className="relative">
                                            <Component
                                                key={index}
                                                index={index}
                                                userId={userId}
                                                activeChat={activeChat}
                                                message={message}
                                                reactions={message.reactions}
                                                showName={message.sender !== userId && showAvatar && activeChat.group}
                                                replyMessage={message?.reply}
                                            />
                                            {isPopupOpenIndex === index && (
                                                <PopupMenuForChat
                                                    setIsPopupOpen={setIsPopupOpenIndex}
                                                    position={position}
                                                    message={message}
                                                />
                                            )}
                                            {sumReaction > 0 && !message.destroy && (
                                                <div
                                                    className="absolute flex items-center bottom-[5px] right-[15px] rounded-full p-0.5 bg-white text-[12px] cursor-pointer dark:bg-gray-700"
                                                    onClick={() => setOpenReactionChat(true)}
                                                >
                                                    {message.reactions.slice(0, 2).map((re, index) => {
                                                        return <div key={index}>{re.reaction}</div>;
                                                    })}
                                                    {sumReaction >= 2 && (
                                                        <div className="text-gray-500 text-[10px]">{sumReaction}</div>
                                                    )}
                                                </div>
                                            )}
                                            {hoveredMessage === index &&
                                                isPopupOpenIndex === null &&
                                                !message.destroy && (
                                                    <button
                                                        className="absolute bottom-[8px] right-[-8px] rounded-full p-0.5 text-[12px] bg-white dark:bg-gray-700"
                                                        onMouseEnter={() => setShowPopupReaction(true)}
                                                        onMouseLeave={() =>
                                                            !showPopupReaction && setShowPopupReaction(false)
                                                        }
                                                    >
                                                        <AiOutlineLike className="text-gray-400 " size={13} />
                                                    </button>
                                                )}

                                            {showPopupReaction &&
                                                hoveredMessage === index &&
                                                isPopupOpenIndex === null && (
                                                    <PopupReacttion
                                                        position={position}
                                                        setShowPopupReaction={setShowPopupReaction}
                                                        chatId={activeChat.id}
                                                        message={message}
                                                        reactions={message.reactions}
                                                        userId={userId}
                                                    />
                                                )}
                                            {openReactionChat && hoveredMessage === index && (
                                                <PopupReactionChat
                                                    onClose={setOpenReactionChat}
                                                    reactions={message.reactions}
                                                />
                                            )}
                                        </div>

                                        {hoveredMessage === index &&
                                            isPopupOpenIndex === null &&
                                            message.sender.id !== userActive.id && (
                                                <div className="relative flex ">
                                                    <button
                                                        className={`absolute dark:bg-gray-700 right-[-25px] bottom-[30px] p-1 rounded-full hover:bg-gray-300 hover:text-blue-500 hover:dark:bg-blue-300 hover:dark:text-gray-100`}
                                                        onClick={() => {
                                                            setIsPopupOpenIndex(index);
                                                        }}
                                                    >
                                                        <FiMoreHorizontal size={15} />
                                                    </button>
                                                    <button
                                                        className={`absolute dark:bg-gray-700 right-[-50px] bottom-[30px] p-1 rounded-full hover:bg-gray-300 hover:text-blue-500 hover:dark:bg-blue-300 hover:dark:text-gray-100`}
                                                        onClick={() => {
                                                            setReplyMessage(message);
                                                        }}
                                                    >
                                                        <MdOutlineReply size={15} />
                                                    </button>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div>
                <div className="flex bg-white dark:bg-gray-800 border-t dark:border-t-black p-2 ">
                    <div>
                        <LuSticker
                            className="text-2xl cursor-pointer ml-5 hover:text-blue-500 text-gray-600 dark:text-gray-300"
                            onClick={() => dispatch(openEmojiTab('sticker'))}
                        />
                    </div>
                    <div>
                        {/* Input chọn ảnh (ẩn đi) */}
                        <input
                            type="file"
                            accept="image/*"
                            ref={inputImageRef}
                            onChange={(event) => handleFileChange(event, 'image')}
                            className="hidden"
                        />

                        {/* Icon mở thư mục chọn ảnh */}
                        <IoImageOutline
                            className="text-2xl cursor-pointer ml-5 hover:text-blue-500 text-gray-600 dark:text-gray-300"
                            onClick={() => inputImageRef.current.click()} // Kích hoạt input khi nhấn vào icon
                        />
                    </div>
                    <div>
                        {/* Input chọn file (ẩn đi) */}
                        <input
                            type="file"
                            accept=".doc,.docx,.xls,.xlsx,.pdf,.txt,.ppt,.pptx,.csv"
                            ref={inputFileRef}
                            onChange={(event) => handleFileChange(event, 'file')}
                            className="hidden"
                        />

                        {/* Icon mở thư mục chọn file */}
                        <MdAttachFile
                            className="text-2xl cursor-pointer ml-5 hover:text-blue-500 text-gray-600 dark:text-gray-300"
                            onClick={() => inputFileRef.current.click()}
                        />
                    </div>

                    <FaRegAddressCard className="text-2xl cursor-pointer ml-5 hover:text-blue-500 text-gray-600 dark:text-gray-300" />
                </div>
                <div className=" border-t dark:border-t-black p-2 dark:bg-gray-800">
                    <div>
                        {replyMessage && (
                            <div className="relative mb-2 p-2 pl-[15px] bg-gray-100 dark:bg-gray-700 rounded-lg justify-between items-center">
                                <CiCircleRemove
                                    size={20}
                                    className="absolute right-[10px] ml-2 text-gray-500 dark:text-gray-300 cursor-pointer hover:text-red-500"
                                    onClick={() => setReplyMessage(null)}
                                />
                                <div className="flex mb-1">
                                    <p className="text-[12px] text-gray-500 dark:text-gray-300 mr-1">Trả lời:</p>

                                    <p className="text-[12px] font-medium text-gray-600 dark:text-gray-300">
                                        {replyMessage.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[12px] text-gray-600 dark:text-gray-300 max-w-[500px] truncate">
                                        {replyMessage.type === 'file' ? (
                                            <div className="flex items-center">
                                                {getFileIcon(replyMessage.fileType)}
                                                <div className="flex flex-col">
                                                    <p className="text-[12px] font-bold">{replyMessage.fileName}</p>
                                                    <p className="text-[12px] text-gray-500 dark:text-gray-300 pt-1">
                                                        {replyMessage.fileSize}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : replyMessage.type === 'image' ? (
                                            <img
                                                src={replyMessage.content}
                                                alt="content"
                                                className="max-w-[80px] rounded-lg"
                                            />
                                        ) : replyMessage.type === 'gif' ? (
                                            <img
                                                src={replyMessage.content}
                                                alt="GIF"
                                                className="max-w-[80px] rounded-lg "
                                            />
                                        ) : replyMessage.type === 'sticker' ? (
                                            <img
                                                src={replyMessage.content}
                                                alt="GIF"
                                                className="max-w-[50px] rounded-lg "
                                            />
                                        ) : (
                                            replyMessage.content
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center">
                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault(); // Ngăn xuống dòng
                                    handleSendMessage(); // Gọi hàm gửi tin nhắn
                                }
                            }}
                            placeholder={`Nhập tin nhắn với ${activeChat?.name}`}
                            className="flex-1 p-1 font-base text-[14px] rounded-lg focus:border-blue-500 focus:outline-none
                            h-[30px] max-h-[200px] overflow-y-auto resize-none dark:bg-gray-800 dark:text-gray-300"
                        />

                        <div className="flex items-center">
                            <MdOutlineEmojiEmotions
                                className="text-2xl cursor-pointer ml-3 text-gray-500 mr-3 hover:text-blue-500 dark:text-gray-300"
                                onClick={() => dispatch(openEmojiTab('emoji'))}
                            />
                            {message !== '' ? (
                                <IoMdSend
                                    className="text-2xl cursor-pointer ml-3 text-blue-500 mr-3"
                                    onClick={handleSendMessage}
                                />
                            ) : (
                                <AiFillLike
                                    className="text-2xl cursor-pointer ml-3 text-yellow-500 mr-3"
                                    onClick={() => {
                                        const currentTime = new Date().toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        });
                                        return dispatch(
                                            sendMessage({
                                                chatId: activeChat.id,
                                                content: '👍',
                                                time: currentTime,
                                                type: 'text',
                                            }),
                                        );
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TabMessage;
