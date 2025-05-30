function ChatSticker({ userId, message, showName, replyMessage }) {
    return (
        <div className={`relative rounded-lg`}>
            <div>
                {replyMessage && (
                    <div className="mb-1 bg-gray-300 dark:bg-gray-700 p-2 rounded-[5px]">
                        <p className="text-[12px] font-medium text-gray-600 dark:text-gray-300 ">{replyMessage.name}</p>
                        <div>
                            <p className="text-[12px] text-gray-600 dark:text-gray-300 max-h-[50px] overflow-hidden text-ellipsis break-words whitespace-pre-wrap line-clamp-3">
                                {replyMessage.content}
                            </p>
                        </div>
                    </div>
                )}
            </div>
            {showName && (
                <p className="text-[10px] text-gray-400 pb-[2px]">
                    {message?.sender.id !== userId && message?.sender.name}
                </p>
            )}
            <img src={message.content} alt="STICKER" className="w-[150px] h-[150px] rounded-lg" />
            <p className={`absolute left-[8px] bottom-[5px] text-gray-500 text-[10px]`}>
                {new Date(message.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </p>
        </div>
    );
}

export default ChatSticker;
