function ChatGif({ index, message, setHoveredMessage }) {
    return (
        <div
            className="relative pb-2 mb-2"
            onMouseEnter={() => setHoveredMessage(index)}
            onMouseLeave={() => setHoveredMessage(null)}
        >
            <img src={message.content} alt="GIF" className="max-w-[300px] rounded-lg mb-4 " />
            <p className="absolute left-[8px] bottom-[2px] text-gray-500 text-[10px]">{message.time}</p>
        </div>
    );
}

export default ChatGif;
