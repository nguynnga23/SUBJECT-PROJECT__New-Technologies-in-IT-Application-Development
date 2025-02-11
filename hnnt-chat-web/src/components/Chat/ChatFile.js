import { CiFileOn } from 'react-icons/ci';
import { FiMoreHorizontal } from 'react-icons/fi';

function ChatFile({ index, message, setHoveredMessage, hoveredMessage }) {
    return (
        <div
            className={`relative pb-2 p-3 mb-2 border border-gray-300 rounded-lg bg-gray-100 max-w-[500px] ${
                message.sender === 0 ? 'bg-blue-100' : 'bg-white'
            }`}
            onMouseEnter={() => setHoveredMessage(index)}
            onMouseLeave={() => setTimeout(() => setHoveredMessage(null), 2000)}
        >
            <div className="flex items-center space-x-3 mb-4">
                {/* Nút tải file */}
                <a
                    href={message.content}
                    download={message.content}
                    className="hover:underline text-blue-500 text-sm flex"
                >
                    {/* Icon file */}
                    <CiFileOn className="text-3xl text-blue-500 mr-2" />
                    {/* Thông tin file */}
                    <div className="flex flex-col">
                        <p className="text-sm font-semibold">{message.fileName}</p>
                        <p className="text-xs text-gray-500">{message.fileSize}</p>
                    </div>
                </a>
            </div>

            {/* Thời gian gửi */}
            <p className="absolute left-[8px] bottom-[2px] text-gray-500 text-[10px]">{message.time}</p>
            {hoveredMessage === index && (
                <button
                    className="absolute bottom-2 left-[-25px] p-1 rounded-full hover:bg-gray-300"
                    onMouseEnter={() => setHoveredMessage(index)}
                    onMouseLeave={() => setTimeout(() => setHoveredMessage(null), 2000)}
                >
                    <FiMoreHorizontal size={15} />
                </button>
            )}
        </div>
    );
}

export default ChatFile;
