import PopupViewImage from '../Popup/PopupViewImage';
import { FiMoreHorizontal } from 'react-icons/fi';

import { useState } from 'react';
import PopupMenuForChat from '../Popup/PopupMenuForChat';

function ChatImage({ index, message, setHoveredMessage, hoveredMessage, isPopupOpenIndex, setIsPopupOpenIndex }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const position = message.sender === 0 ? 'left' : 'right';

    return (
        <div
            className={`relative pb-2 mb-2 ${message.sender === 0 ? 'bg-blue-100' : 'bg-white'}`}
            onMouseEnter={() => {
                if (isPopupOpenIndex === null) setHoveredMessage(index);
            }}
            onMouseLeave={() => {
                setTimeout(() => {
                    if (isPopupOpenIndex === null) setHoveredMessage(null);
                }, 3000);
            }}
        >
            <img
                src={message.content}
                alt="GIF"
                className="max-w-[500px] mb-4 rounded-lg"
                onClick={() => setSelectedImage(message.content)}
            />
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

            {selectedImage && <PopupViewImage selectedImage={selectedImage} setSelectedImage={setSelectedImage} />}
        </div>
    );
}

export default ChatImage;
