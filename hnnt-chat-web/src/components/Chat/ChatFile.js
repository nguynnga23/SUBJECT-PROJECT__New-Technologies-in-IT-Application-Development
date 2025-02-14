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

function ChatFile({ index, message, setHoveredMessage, hoveredMessage, isPopupOpenIndex, setIsPopupOpenIndex }) {
    const position = message.sender === 0 ? 'right' : 'left';
    const [reaction, setReaction] = useState([]);
    const [showPopupReaction, setShowPopupReaction] = useState(false);

    return (
        <div
            className={`relative pb-2 p-3 mb-2 border border-gray-300 rounded-lg bg-gray-100 max-w-[500px] ${
                message.sender === 0 ? 'bg-blue-100' : 'bg-white'
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

            {reaction?.length > 0 && (
                <div className="absolute flex items-center bottom-[-8px] right-[15px] border rounded-full p-0.5 bg-white text-[12px]">
                    {reaction.slice(0, 2).map((re, index) => (
                        <div key={index}>{re}</div>
                    ))}
                    {reaction.length > 2 && <div className="text-gray-500 text-[10px]">{reaction.length}</div>}
                </div>
            )}

            {hoveredMessage === index && isPopupOpenIndex === null && (
                <div>
                    <button
                        className={`absolute bottom-2 ${
                            message.sender === 0 ? 'left-[-25px]' : 'right-[-25px]'
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
                    reaction={reaction}
                    setReaction={setReaction}
                />
            )}
        </div>
    );
}

export default ChatFile;
