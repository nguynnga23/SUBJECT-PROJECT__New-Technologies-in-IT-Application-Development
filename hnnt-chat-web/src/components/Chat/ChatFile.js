import { FiMoreHorizontal } from 'react-icons/fi';
import { MdFilePresent } from 'react-icons/md';
import PopupMenuForChat from '../Popup/PopupMenuForChat';
import { VscFilePdf } from 'react-icons/vsc';
import { FaRegFileWord } from 'react-icons/fa';
import { FaRegFileExcel } from 'react-icons/fa';
import { FaRegFilePowerpoint } from 'react-icons/fa';
import { AiOutlineLike } from 'react-icons/ai';
import PopupReacttion from '../Popup/PopupReaction';
import { useState } from 'react';

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

function ChatFile({
    index,
    userId,
    activeChat,
    message,
    setHoveredMessage,
    hoveredMessage,
    isPopupOpenIndex,
    setIsPopupOpenIndex,
    reactions,
    showName,
}) {
    const position = message.sender === userId ? 'right' : 'left';
    const sumReaction = reactions.reduce((total, reaction) => total + reaction.sum, 0);

    const [showPopupReaction, setShowPopupReaction] = useState(false);

    return (
        <div
            className={`relative pb-2 p-3 mb-2 border border-gray-300 rounded-lg bg-gray-100 max-w-[500px] ${
                message.sender === userId ? 'bg-blue-100' : 'bg-white'
            }`}
            onMouseEnter={() => {
                if (isPopupOpenIndex === null) setHoveredMessage(index);
            }}
            onMouseLeave={() => {
                setTimeout(() => {
                    if (isPopupOpenIndex === null) setHoveredMessage(null);
                }, 3000);
            }}
        >
            {showName && (
                <p className="text-[10px] text-gray-400 pb-[2px]">{message?.sender !== userId && message?.name}</p>
            )}

            <div className="flex items-center space-x-3 mb-4">
                {/* Nút tải file */}
                <a
                    href={message.content}
                    download={message.fileName}
                    className="hover:underline text-blue-500 text-sm flex"
                >
                    {/* Icon file */}
                    {getFileIcon(message.fileType)}
                    {/* Thông tin file */}
                    <div className="flex flex-col">
                        <p className="text-[12px] font-bold">{message.fileName}</p>
                        <p className="text-[12px] text-gray-500 pt-1">{message.fileSize}</p>
                    </div>
                </a>
            </div>

            {/* Thời gian gửi */}
            <p className="absolute left-[8px] bottom-[10px] text-gray-500 text-[10px] mb-2">{message.time}</p>

            {sumReaction > 0 && (
                <div className="absolute flex items-center bottom-[-8px] right-[15px] border rounded-full p-0.5 bg-white text-[12px]">
                    {reactions.slice(0, 2).map((re, index) => {
                        return <div key={index}>{re.reaction}</div>;
                    })}
                    {sumReaction >= 2 && <div className="text-gray-500 text-[10px]">{sumReaction}</div>}
                </div>
            )}

            {hoveredMessage === index && isPopupOpenIndex === null && (
                <div>
                    <button
                        className={`absolute bottom-2 ${
                            message.sender === userId ? 'left-[-25px]' : 'right-[-25px]'
                        } p-1 rounded-full hover:bg-gray-300`}
                        onClick={() => {
                            setIsPopupOpenIndex(index);
                        }}
                    >
                        <FiMoreHorizontal size={15} />
                    </button>

                    <button
                        className="absolute bottom-[-8px] right-[-8px] border rounded-full p-0.5 text-[12px] bg-white"
                        onMouseEnter={() => setShowPopupReaction(true)}
                        onMouseLeave={() => !showPopupReaction && setTimeout(() => setShowPopupReaction(false), 500)}
                    >
                        <AiOutlineLike className="text-gray-400 " size={13} />
                    </button>
                </div>
            )}

            {isPopupOpenIndex === index && (
                <PopupMenuForChat setIsPopupOpen={setIsPopupOpenIndex} position={position} message={message} />
            )}
            {showPopupReaction && (
                <PopupReacttion
                    position={position}
                    setShowPopupReaction={setShowPopupReaction}
                    chatId={activeChat.id}
                    message={message}
                    reactions={reactions}
                    userId={0}
                />
            )}
        </div>
    );
}

export default ChatFile;
