import { FiMoreHorizontal } from 'react-icons/fi';
import PopupMenuForChat from '../Popup/PopupMenuForChat';
import { AiOutlineLike } from 'react-icons/ai';
import PopupReacttion from '../Popup/PopupReaction';
import { useState } from 'react';

function ChatGif({ index, message, setHoveredMessage, hoveredMessage, isPopupOpenIndex, setIsPopupOpenIndex }) {
    const position = message.sender === 0 ? 'right' : 'left';
    const [reaction, setReaction] = useState([]);
    const [showPopupReaction, setShowPopupReaction] = useState(false);

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
            <img src={message.content} alt="GIF" className="max-w-[300px] rounded-lg mb-4 " />
            <p className="absolute left-[8px] bottom-[2px] text-gray-500 text-[10px]">{message.time}</p>

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

export default ChatGif;
