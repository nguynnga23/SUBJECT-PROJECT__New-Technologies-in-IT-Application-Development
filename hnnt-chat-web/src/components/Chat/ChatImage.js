function ChatImage({ index, message, setHoveredMessage }) {
    return (
        <div
            className="relative pb-2 mb-2"
            onMouseEnter={() => setHoveredMessage(index)}
            onMouseLeave={() => setHoveredMessage(null)}
        >
            <img
                src={message.content}
                alt="GIF"
                className="max-w-[500px] mb-4 rounded-lg"
                onClick={() => setSelectedImage(message.content)}
            />
            <p className="absolute left-[8px] bottom-[2px] text-gray-500 text-[10px]">{message.time}</p>
            {selectedImage && <PopupViewImage selectedImage={selectedImage} setSelectedImage={setSelectedImage} />}
        </div>
    );
}

export default ChatImage;
