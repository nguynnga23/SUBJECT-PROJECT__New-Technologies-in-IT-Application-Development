import { FiMoreHorizontal } from 'react-icons/fi';
import PopupMenuForChat from '../Popup/PopupMenuForChat';
import { AiOutlineLike } from 'react-icons/ai';
import PopupReacttion from '../Popup/PopupReaction';
import { useState } from 'react';

function ChatGif({
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
    const [showPopupReaction, setShowPopupReaction] = useState(false);
    const sumReaction = reactions.reduce((total, reaction) => total + reaction.sum, 0);
    return (
        <div
            className={`relative pb-2 mb-2 ${message.sender === userId ? 'bg-blue-100' : 'bg-white'}`}
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

            <img src={message.content} alt="GIF" className="max-w-[300px] rounded-lg mb-4 " />
            <p className="absolute left-[8px] bottom-[2px] text-gray-500 text-[10px]">{message.time}</p>
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

export default ChatGif;
