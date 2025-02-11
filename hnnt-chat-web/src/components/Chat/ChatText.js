import { FiMoreHorizontal } from 'react-icons/fi';
import PopupMenuForChat from '../Popup/PopupMenuForChat';
import { useState } from 'react';

function ChatText({ index, message, setHoveredMessage, hoveredMessage, isPopupOpenIndex, setIsPopupOpenIndex }) {
    return (
        <div
            key={index}
            className={`relative border border-blue-400 p-2 pb-6 rounded-lg w-fit mb-2 max-w-[500px] min-w-[40px] ${
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
            {message.content}

            <p className="absolute left-[8px] bottom-[4px] text-gray-500 text-[10px]">{message.time}</p>

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
                <div className="absolute top-8 right-2">
                    <PopupMenuForChat setIsPopupOpen={setIsPopupOpenIndex} />
                </div>
            )}
        </div>
    );
}

export default ChatText;
