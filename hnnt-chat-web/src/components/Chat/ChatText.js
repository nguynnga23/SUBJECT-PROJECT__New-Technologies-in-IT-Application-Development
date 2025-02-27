function ChatText({ index, userId, message, reactions, showName }) {
    return (
        <div
            key={index}
            className={`relative text-[14px] border p-2 dark:text-gray-200 cursor-pointer ${
                reactions.length > 0 ? 'pb-8' : 'pb-6'
            } rounded-lg w-fit mb-2 max-w-[500px] min-w-[60px] break-all ${
                message.sender === userId
                    ? 'bg-blue-100 dark:bg-[#20344c] border-blue-200 dark:border-blue-100'
                    : 'bg-white dark:bg-[#20344c] border-gray-200 dark:border-gray-800'
            }`}
        >
            {showName && (
                <p className="text-[10px] text-gray-400 pb-[2px]">{message?.sender !== userId && message?.name}</p>
            )}
            {message.content}

            <p
                className={`absolute left-[8px] ${
                    reactions.length > 0 ? 'bottom-[16px]' : 'bottom-[5px]'
                } text-gray-500 text-[10px]`}
            >
                {message.time}
            </p>
        </div>
    );
}

export default ChatText;
