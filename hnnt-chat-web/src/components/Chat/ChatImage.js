import PopupViewImage from '../Popup/PopupViewImage';

import { useState } from 'react';

function ChatImage({ userId, message, showName, replyMessage }) {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <div className={`relative rounded-lg pb-2 cursor-pointer `}>
            {showName && (
                <p className="text-[10px] text-gray-400 pb-[2px]">{message?.sender.id !== userId && message?.name}</p>
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
            <img
                src={message.content}
                alt="content"
                className="max-w-[300px] mb-4 rounded-lg"
                onClick={() => setSelectedImage(message.content)}
            />
            <p className="absolute left-[8px] bottom-[2px] text-gray-500 text-[10px]">
                {new Date(message.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </p>

            {selectedImage && <PopupViewImage selectedImage={selectedImage} setSelectedImage={setSelectedImage} />}
        </div>
    );
}

export default ChatImage;
