import PopupViewImage from '../Popup/PopupViewImage';
import { FiMoreHorizontal } from 'react-icons/fi';

import { useState } from 'react';

function ChatImage({ index, message, setHoveredMessage, hoveredMessage }) {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <div
            className={`relative pb-2 mb-2 ${message.sender === 0 ? 'bg-blue-100' : 'bg-white'}`}
            onMouseEnter={() => setHoveredMessage(index)}
            onMouseLeave={() => setTimeout(() => setHoveredMessage(null), 2000)}
        >
            <img
                src={message.content}
                alt="GIF"
                className="max-w-[500px] mb-4 rounded-lg"
                onClick={() => setSelectedImage(message.content)}
            />
            <p className="absolute left-[8px] bottom-[2px] text-gray-500 text-[10px]">{message.time}</p>
            {hoveredMessage === index && (
                <button
                    className="absolute bottom-2 left-[-25px] p-1 rounded-full hover:bg-gray-300"
                    onMouseEnter={() => setHoveredMessage(index)}
                    onMouseLeave={() => setTimeout(() => setHoveredMessage(null), 2000)}
                >
                    <FiMoreHorizontal size={15} />
                </button>
            )}

            {selectedImage && <PopupViewImage selectedImage={selectedImage} setSelectedImage={setSelectedImage} />}
        </div>
    );
}

export default ChatImage;
