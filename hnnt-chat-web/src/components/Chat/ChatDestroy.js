import { FiMoreHorizontal } from 'react-icons/fi';
import PopupMenuForChat from '../Popup/PopupMenuForChat';

function ChatDestroy({
    index,
    userId,
    message,
    setHoveredMessage,
    hoveredMessage,
    isPopupOpenIndex,
    setIsPopupOpenIndex,
    showName,
}) {
    const position = message.sender === userId ? 'right' : 'left';
    return (
        <div
            key={index}
            className={`relative text-[12px] border border-gray-400 p-2 rounded-lg w-fit mb-2 max-w-[500px] min-w-[40px] break-all bg-gray-200 `}
        >
            {showName && (
                <p className="text-[10px] text-gray-400 pb-[2px]">{message?.sender !== userId && message?.name}</p>
            )}
            <p className="text-gray-400 italic">Tin nhắn đã được thu hồi</p>

            {isPopupOpenIndex === index && (
                <PopupMenuForChat setIsPopupOpen={setIsPopupOpenIndex} position={position} message={message} />
            )}
        </div>
    );
}

export default ChatDestroy;
