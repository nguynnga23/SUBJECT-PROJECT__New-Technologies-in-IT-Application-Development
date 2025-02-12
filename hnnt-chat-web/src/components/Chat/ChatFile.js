import { CiFileOn } from 'react-icons/ci';
import { FiMoreHorizontal } from 'react-icons/fi';
import PopupMenuForChat from '../Popup/PopupMenuForChat';

function ChatFile({ index, message, setHoveredMessage, hoveredMessage, isPopupOpenIndex, setIsPopupOpenIndex }) {
    const position = message.sender === 0 ? 'right' : 'left';

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
                    download={message.content}
                    className="hover:underline text-blue-500 text-sm flex"
                >
                    {/* Icon file */}
                    <CiFileOn className="text-3xl text-blue-500 mr-2" />
                    {/* Thông tin file */}
                    <div className="flex flex-col">
                        <p className="text-sm font-semibold">{message.fileName}</p>
                        <p className="text-xs text-gray-500">{message.fileSize}</p>
                    </div>
                </a>
            </div>

            {/* Thời gian gửi */}
            <p className="absolute left-[8px] bottom-[2px] text-gray-500 text-[10px]">{message.time}</p>
            {hoveredMessage === index && isPopupOpenIndex === null && (
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
            )}

            {isPopupOpenIndex === index && (
                <PopupMenuForChat setIsPopupOpen={setIsPopupOpenIndex} position={position} />
            )}
        </div>
    );
}

export default ChatFile;
