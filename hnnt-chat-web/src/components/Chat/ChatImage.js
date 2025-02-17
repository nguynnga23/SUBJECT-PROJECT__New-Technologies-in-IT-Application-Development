import PopupViewImage from '../Popup/PopupViewImage';
import { FiMoreHorizontal } from 'react-icons/fi';

import { useState } from 'react';
import PopupMenuForChat from '../Popup/PopupMenuForChat';
import { AiOutlineLike } from 'react-icons/ai';
import PopupReaction from '../Popup/PopupReaction';
import userActive from '../../sample_data/userActive';

function ChatImage({
    index,
    activeChat,
    message,
    setHoveredMessage,
    hoveredMessage,
    isPopupOpenIndex,
    setIsPopupOpenIndex,
    reactions,
    showName,
}) {
    const userId = userActive.id;
    const [selectedImage, setSelectedImage] = useState(null);
    const position = message.sender === userId ? 'right' : 'left';
    const sumReaction = reactions.reduce((total, reaction) => total + reaction.sum, 0);

    const [showPopupReaction, setShowPopupReaction] = useState(false);

    return (
        <div
            className={`relative rounded-lg pb-2 `}
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

            <img
                src={message.content}
                alt="GIF"
                className="max-w-[500px] mb-4 rounded-lg"
                onClick={() => setSelectedImage(message.content)}
            />
            <p className="absolute left-[8px] bottom-[2px] text-gray-500 text-[10px]">{message.time}</p>

            {sumReaction > 0 && (
                <div className="absolute flex items-center bottom-[12px] right-[15px] border rounded-full p-0.5 bg-white text-[12px]">
                    {reactions.slice(0, 2).map((re, index) => (
                        <div key={index}>{re.reaction}</div>
                    ))}
                    {sumReaction > 2 && <div className="text-gray-500 text-[10px]">{sumReaction}</div>}
                </div>
            )}

            {hoveredMessage === index && isPopupOpenIndex === null && (
                <div>
                    <button
                        className={`absolute bottom-2 ${
                            message.sender === userId ? 'left-[-25px]' : 'right-[-25px]'
                        } bottom-[30px] p-1 rounded-full hover:bg-gray-300`}
                        onClick={() => {
                            setIsPopupOpenIndex(index);
                        }}
                    >
                        <FiMoreHorizontal size={15} />
                    </button>
                    <button
                        className="absolute bottom-[15px] right-[-8px] border rounded-full p-0.5 text-[12px] bg-white"
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

            {selectedImage && <PopupViewImage selectedImage={selectedImage} setSelectedImage={setSelectedImage} />}
            {showPopupReaction && (
                <PopupReaction
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

export default ChatImage;
