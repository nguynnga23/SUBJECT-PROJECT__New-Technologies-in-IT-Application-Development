function ChatSticker({ userId, message, showName }) {
    return (
        <div className={`relative rounded-lg`}>
            {showName && (
                <p className="text-[10px] text-gray-400 pb-[2px]">{message?.sender !== userId && message?.name}</p>
            )}
            <img src={message.content} alt="GIF" className="w-[150px] h-[150px] rounded-lg mb-2 " />
            <p className="absolute left-[8px] bottom-[2px] text-gray-500 text-[10px]">{message.time}</p>
        </div>
    );
}

export default ChatSticker;
