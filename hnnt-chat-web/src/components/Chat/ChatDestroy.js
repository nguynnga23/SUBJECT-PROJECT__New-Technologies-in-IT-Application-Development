import { FiMoreHorizontal } from 'react-icons/fi';
import PopupMenuForChat from '../Popup/PopupMenuForChat';
import { useSelector } from 'react-redux';

function ChatDestroy({ index, message, setHoveredMessage, hoveredMessage, isPopupOpenIndex, setIsPopupOpenIndex }) {
    const position = message.sender === 0 ? 'right' : 'left';
    return (
        <div
            key={index}
            className={`relative text-[12px] border border-gray-400 p-2 rounded-lg w-fit mb-2 max-w-[500px] min-w-[40px] break-all bg-gray-200 `}
            onMouseEnter={() => {
                if (isPopupOpenIndex === null) setHoveredMessage(index);
            }}
            onMouseLeave={() => {
                setTimeout(() => {
                    if (isPopupOpenIndex === null) setHoveredMessage(null);
                }, 3000);
            }}
        >
            <p className="text-gray-400 italic">Tin nhắn đã được thu hồi</p>
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

export default ChatDestroy;
