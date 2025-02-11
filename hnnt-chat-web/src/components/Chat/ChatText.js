function ChatText({ index, message, setHoveredMessage }) {
    return (
        <p
            key={index}
            className={` relative border border-blue-400 p-2 pb-6 rounded-lg w-fit mb-2 max-w-[500px] min-w-[40px] ${
                message.sender === 0 ? 'bg-blue-100' : 'bg-white'
            }`}
            onMouseEnter={() => setHoveredMessage(index)}
            onMouseLeave={() => setHoveredMessage(null)}
        >
            {message.content}
            <p className="absolute left-[8px] bottom-[4px] text-gray-500 text-[10px]">{message.time}</p>
        </p>
    );
}

export default ChatText;
