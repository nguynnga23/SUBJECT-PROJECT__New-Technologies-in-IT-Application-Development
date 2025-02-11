import { FiMoreVertical } from 'react-icons/fi';

function ChatText({ index, message, setHoveredMessage, hoveredMessage }) {
    return (
        <p
            key={index}
            className={` relative border border-blue-400 p-2 pb-6 rounded-lg w-fit mb-2 max-w-[500px] min-w-[40px] ${
                message.sender === 0 ? 'bg-blue-100' : 'bg-white'
            }`}
            onMouseEnter={() => setHoveredMessage(index)}
            onMouseLeave={() => setTimeout(() => setHoveredMessage(null), 2000)}
        >
            {message.content}
            <p className="absolute left-[8px] bottom-[4px] text-gray-500 text-[10px]">{message.time}</p>
            {hoveredMessage === index && (
                <button
                    className={`absolute bottom-2 ${
                        message.sender === 0 ? 'left-[-25px]' : 'right-[-25px]'
                    } p-1 rounded-full hover:bg-gray-300`}
                    onMouseEnter={() => setHoveredMessage(index)}
                    onMouseLeave={() => setTimeout(() => setHoveredMessage(null), 2000)}
                >
                    <FiMoreVertical size={15} />
                </button>
            )}
        </p>
    );
}

export default ChatText;
