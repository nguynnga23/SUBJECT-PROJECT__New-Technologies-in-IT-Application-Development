import PopupViewImage from '../Popup/PopupViewImage';

import { useState } from 'react';

function ChatImage({ userId, message, showName }) {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <div className={`relative rounded-lg pb-2 cursor-pointer `}>
            {showName && (
                <p className="text-[10px] text-gray-400 pb-[2px]">{message?.sender !== userId && message?.name}</p>
            )}

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
