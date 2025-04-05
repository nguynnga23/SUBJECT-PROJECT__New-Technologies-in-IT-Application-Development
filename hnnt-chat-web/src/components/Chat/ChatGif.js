function ChatGif({ userId, message, showName, replyMessage }) {
    return (
        <div className={`relative pb-2 ${message.sender === userId ? 'bg-blue-100' : 'bg-white'}`}>
            {showName && (
                <p className="text-[10px] text-gray-400 pb-[2px]">{message?.sender !== userId && message?.name}</p>
            )}
            <div>
                {replyMessage && (
                    <div className="mb-1 bg-gray-300 dark:bg-gray-700  p-2 rounded-[5px]">
                        <p className="text-[12px] font-medium text-gray-600 dark:text-gray-300 ">{replyMessage.name}</p>
                        <div>
                            <p className="text-[12px] text-gray-600 dark:text-gray-300 max-h-[50px] overflow-hidden text-ellipsis break-words whitespace-pre-wrap line-clamp-3">
                                {replyMessage.content}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <img src={message.content} alt="GIF" className="max-w-[300px] rounded-lg mb-4 " />
            <p className="absolute left-[8px] bottom-[2px] text-gray-500 text-[10px]">{message.time}</p>
        </div>
    );
}

export default ChatGif;
