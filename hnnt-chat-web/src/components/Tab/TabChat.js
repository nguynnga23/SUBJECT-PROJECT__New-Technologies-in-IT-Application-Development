import { useState, useRef, useEffect } from 'react';
import { IoMdSend } from 'react-icons/io';
import { MdLabelOutline } from 'react-icons/md';
import { VscLayoutSidebarRightOff } from 'react-icons/vsc';
import { VscLayoutSidebarRight } from 'react-icons/vsc';
import { BsTelephone } from 'react-icons/bs';
import { GoDeviceCameraVideo } from 'react-icons/go';
import { IoSearchOutline } from 'react-icons/io5';
import { AiFillLike } from 'react-icons/ai';
import { IoImageOutline } from 'react-icons/io5';
import { MdAttachFile } from 'react-icons/md';
import { FaRegAddressCard } from 'react-icons/fa6';
import { MdOutlineEmojiEmotions } from 'react-icons/md';

import PopupCategory from '../Popup/PopupCategory';

import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
    setShowOrOffRightBar,
    setShowOrOffRightBarSearch,
    sendMessage,
    openEmojiTab,
} from '../../redux/slices/chatSlice';
import ChatText from '../Chat/ChatText';
import ChatGif from '../Chat/ChatGif';
import ChatImage from '../Chat/ChatImage';
import ChatFile from '../Chat/ChatFile';
import ChatDestroy from '../Chat/ChatDestroy';

function TabChat() {
    const [message, setMessage] = useState('');
    const [isOpenCategory, setIsOpenCategory] = useState(false);

    const activeChat = useSelector(
        (state) => state.chat.chats.find((chat) => chat.id === state.chat.activeChat?.id),
        shallowEqual,
    );

    const dispatch = useDispatch();
    const showRightBar = useSelector((state) => state.chat.showRightBar);
    const showRightBarSearch = useSelector((state) => state.chat.showRightBarSearch);
    const emojiObject = useSelector((state) => state.chat.emojiObject);
    const gifObject = useSelector((state) => state.chat.gifObject);

    const textareaRef = useRef(null);

    const inputImageRef = useRef(null); // Tạo tham chiếu đến input image
    const inputFileRef = useRef(null); // Tạo tham chiếu đến input image
    const chatContainerRef = useRef(null);

    const [hoveredMessage, setHoveredMessage] = useState(null);
    const [isPopupOpenIndex, setIsPopupOpenIndex] = useState(null);

    const MessageComponent = {
        text: ChatText,
        gif: ChatGif,
        image: ChatImage,
        file: ChatFile,
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [activeChat.messages]);

    // Hàm tự động điều chỉnh chiều cao
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = '50px'; // Reset chiều cao trước khi tính toán
            const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
            textareaRef.current.style.height = `${newHeight}px`;
        }
    }, [message]);

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            const currentTime = new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            });
            dispatch(sendMessage({ chatId: activeChat.id, content: message, time: currentTime, type: 'text' }));
            setMessage('');
        }
    };

    useEffect(() => {
        if (emojiObject != null) {
            setMessage((prev) => prev + emojiObject.emoji);
        }
    }, [emojiObject]);

    useEffect(() => {
        if (gifObject != null) {
            const currentTime = new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            });

            dispatch(sendMessage({ chatId: activeChat.id, content: gifObject.url, time: currentTime, type: 'gif' }));
        }
    }, [gifObject]);

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
                    time: currentTime,
                    type: type,
                }),
            );
        }
    };

    return (
        <>
            <div className="p-2 border-b flex justify-between items-center h-[62px] min-w-[600px] ">
                <div className="flex justify-center ">
                    <img
                        src={activeChat.avatar} // Thay bằng avatar thật
                        className="w-[45px] h-[45px] rounded-full border mr-2 object-cover"
                    />
                    <div>
                        <h3 className="font-medium text-base text-lg max-h-[28px]">{activeChat.name}</h3>
                        <MdLabelOutline
                            className="cursor-pointer"
                            color="gray"
                            onClick={() => setIsOpenCategory(!isOpenCategory)}
                        />
                    </div>
                    {isOpenCategory && <PopupCategory isOpen={isOpenCategory} setIsOpen={setIsOpenCategory} />}
                </div>
                <div className="p-2 flex">
                    <BsTelephone
                        size={26}
                        className="ml-1.5 p-1 hover:text-gray-500 hover:bg-gray-200  hover:rounded-[5px] cursor-pointer"
                    />
                    <GoDeviceCameraVideo
                        size={26}
                        className="ml-1.5 p-1 hover:text-gray-500 hover:bg-gray-200  hover:rounded-[5px] cursor-pointer"
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
                            className="ml-1.5 text-gray-700 p-1 hover:text-gray-500 hover:rounded-[5px] hover:bg-gray-200 cursor-pointer"
                            onClick={() => dispatch(setShowOrOffRightBar(!showRightBar))}
                        />
                    )}
                </div>
            </div>
            <div className="flex-1 p-4 overflow-auto bg-gray-200 " ref={chatContainerRef}>
                {activeChat.messages.map((message, index) => {
                    const isDeleted = message.delete;
                    const Component = message.destroy ? ChatDestroy : MessageComponent[message.type];

                    return (
                        <div className={` flex ${message.sender === 0 ? 'justify-end' : 'justify-start'}`}>
                            {!isDeleted && Component && (
                                <Component
                                    key={index}
                                    index={index}
                                    message={message}
                                    setHoveredMessage={setHoveredMessage}
                                    hoveredMessage={hoveredMessage}
                                    isPopupOpenIndex={isPopupOpenIndex}
                                    setIsPopupOpenIndex={setIsPopupOpenIndex}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
            <div>
                <div className="flex bg-white border-t p-2">
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
                            className="text-2xl cursor-pointer ml-5 hover:text-blue-500 text-gray-500"
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
                            className="text-2xl cursor-pointer ml-5 hover:text-blue-500 text-gray-500"
                            onClick={() => inputFileRef.current.click()}
                        />
                    </div>

                    <FaRegAddressCard className="text-2xl cursor-pointer ml-5 hover:text-blue-500 text-gray-500" />
                </div>
                <div className="flex items-center border-t p-2">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                        }}
                        placeholder={`Nhập tin nhắn với ${activeChat.name}`}
                        className="flex-1 p-3 font-base text-[12px] rounded-lg focus:border-blue-500 focus:outline-none
                           h-[50px] max-h-[200px] overflow-y-auto resize-none"
                    />

                    <div className="flex items-center">
                        <MdOutlineEmojiEmotions
                            className="text-2xl cursor-pointer ml-3 text-gray-500 mr-3 hover:text-blue-500"
                            onClick={() => dispatch(openEmojiTab())}
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
        </>
    );
}

export default TabChat;
