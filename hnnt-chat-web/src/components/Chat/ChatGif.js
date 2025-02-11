import { FiMoreVertical } from 'react-icons/fi';

function ChatGif({ index, message, setHoveredMessage, hoveredMessage }) {
    return (
        <div
            className={`relative pb-2 mb-2 ${message.sender === 0 ? 'bg-blue-100' : 'bg-white'}`}
            onMouseEnter={() => setHoveredMessage(index)}
            onMouseLeave={() => setTimeout(() => setHoveredMessage(null), 2000)}
        >
            <img src={message.content} alt="GIF" className="max-w-[300px] rounded-lg mb-4 " />
            <p className="absolute left-[8px] bottom-[2px] text-gray-500 text-[10px]">{message.time}</p>
            {hoveredMessage === index && (
                <button
                    className="absolute bottom-2 left-[-25px] p-1 rounded-full hover:bg-gray-300"
                    onMouseEnter={() => setHoveredMessage(index)}
                    onMouseLeave={() => setTimeout(() => setHoveredMessage(null), 2000)}
                >
                    <FiMoreVertical size={15} />
                </button>
            )}
        </div>
    );
}

export default ChatGif;
