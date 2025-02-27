import PopupMenuForChat from '../Popup/PopupMenuForChat';

function ChatGif({ userId, message, showName }) {
    return (
        <div className={`relative pb-2 mb-2 ${message.sender === userId ? 'bg-blue-100' : 'bg-white'}`}>
            {showName && (
                <p className="text-[10px] text-gray-400 pb-[2px]">{message?.sender !== userId && message?.name}</p>
            )}

            <img src={message.content} alt="GIF" className="max-w-[300px] rounded-lg mb-4 " />
            <p className="absolute left-[8px] bottom-[2px] text-gray-500 text-[10px]">{message.time}</p>
        </div>
    );
}

export default ChatGif;
