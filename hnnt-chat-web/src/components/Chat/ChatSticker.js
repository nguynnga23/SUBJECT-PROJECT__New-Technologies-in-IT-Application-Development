import { FiMoreHorizontal } from 'react-icons/fi';
import PopupMenuForChat from '../Popup/PopupMenuForChat';

function ChatSticker({
    index,
    message,
    setHoveredMessage,
    hoveredMessage,
    isPopupOpenIndex,
    setIsPopupOpenIndex,
    showName,
}) {
    const position = message.sender === 0 ? 'right' : 'left';
    const userId = 0;
    return (
        <div
            className={`relative rounded-lg`}
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
            <img src={message.content} alt="GIF" className="w-[150px] h-[150px] rounded-lg mb-2 " />
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
                <PopupMenuForChat setIsPopupOpen={setIsPopupOpenIndex} position={position} message={message} />
            )}
        </div>
    );
}

export default ChatSticker;
