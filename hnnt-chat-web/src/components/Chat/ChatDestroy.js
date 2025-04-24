function ChatDestroy({ index, userId, message, showName }) {
    return (
        <div
            key={index}
            className={`relative text-[12px] border border-gray-400 p-3 pb-5 rounded-lg w-fit max-w-[500px] min-w-[40px] break-all bg-gray-200 dark:bg-gray-600`}
        >
            {showName && (
                <p className="text-[12px] text-gray-400 pb-[2px]">
                    {message?.sender.id !== userId && message?.sender.name}
                </p>
            )}
            <p className="text-gray-400 italic">Tin nhắn đã được thu hồi</p>
            <p className={`absolute left-[8px] text-gray-500 text-[10px]`}>
                {new Date(message.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </p>
        </div>
    );
}

export default ChatDestroy;
