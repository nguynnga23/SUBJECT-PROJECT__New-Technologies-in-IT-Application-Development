import { FiMoreHorizontal } from 'react-icons/fi';
import PopupMenuForChat from '../Popup/PopupMenuForChat';
import { AiOutlineLike } from 'react-icons/ai';
import PopupReacttion from '../Popup/PopupReaction';
import { useState } from 'react';

function ChatText({ index, message, setHoveredMessage, hoveredMessage, isPopupOpenIndex, setIsPopupOpenIndex }) {
    const position = message.sender === 0 ? 'right' : 'left';
    const [showPopupReaction, setShowPopupReaction] = useState(false);
    const [reaction, setReaction] = useState([]);
    return (
        <div
            key={index}
            className={`relative text-[14px] border border-blue-400 p-2 ${
                reaction.length > 0 ? 'pb-8' : 'pb-6'
            } rounded-lg w-fit mb-2 max-w-[500px] min-w-[60px] break-all ${
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

            <p
                className={`absolute left-[8px] ${
                    reaction.length > 0 ? 'bottom-[16px]' : 'bottom-[5px]'
                } text-gray-500 text-[10px]`}
            >
                {message.time}
            </p>
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

export default ChatText;
