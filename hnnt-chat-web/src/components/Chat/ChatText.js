import { MdFilePresent } from 'react-icons/md';
import { VscFilePdf } from 'react-icons/vsc';
import { FaRegFileWord } from 'react-icons/fa';
import { FaRegFileExcel } from 'react-icons/fa';
import { FaRegFilePowerpoint } from 'react-icons/fa';

function ChatText({ index, userId, message, reactions, showName, replyMessage, scrollToMessage }) {
    const getFileIcon = (fileType) => {
        if (fileType.includes('pdf')) return <VscFilePdf className="text-3xl text-red-500 mr-2" />;
        if (fileType.includes('excel') || fileType.includes('spreadsheet') || fileType.includes('xls'))
            return <FaRegFileExcel className="text-3xl text-green-600 mr-2" />;
        if (fileType.includes('powerpoint') || fileType.includes('presentation') || fileType.includes('ppt'))
            return <FaRegFilePowerpoint className="text-3xl text-orange-500 mr-2" />;
        if (fileType.includes('word') || fileType.includes('msword') || fileType.includes('document'))
            return <FaRegFileWord className="text-3xl text-blue-600 mr-2" />;
        return <MdFilePresent className="text-3xl text-gray-500 mr-2" />; // Mặc định
    };

    return (
        <div
            key={index}
            className={`relative text-[14px] border p-2 dark:text-gray-200  ${
                reactions.length > 0 ? 'pb-8' : 'pb-6'
            } rounded-[7px] w-fit max-w-[500px] min-w-[60px] break-all ${
                message.sender.id === userId
                    ? 'bg-blue-100 dark:bg-[#20344c] border-blue-200 dark:border-blue-500'
                    : 'bg-white dark:bg-[#20344c] border-gray-200 dark:border-gray-800'
            }`}
        >
            {showName && (
                <p className="text-[10px] text-gray-400 pb-[2px]">{message?.sender.id !== userId && message?.name}</p>
            )}
            <div>
                {replyMessage && (
                    <div
                        className={`mb-1 border-l-[4px] border-blue-500 cursor-pointer ${
                            message.sender.id === userId ? 'bg-blue-200' : 'bg-gray-300'
                        } dark:bg-gray-700  p-2 rounded-[3px]`}
                        onClick={() => scrollToMessage(replyMessage.id)}
                    >
                        <p className="text-[12px] font-medium text-gray-600 dark:text-gray-300 mb-1">
                            {replyMessage.sender.name}
                        </p>
                        <div>
                            <p className="text-[12px] text-gray-600 dark:text-gray-300 max-h-[50px] overflow-hidden text-ellipsis break-words whitespace-pre-wrap line-clamp-3">
                                {replyMessage.type === 'file' ? (
                                    <div className="flex items-center">
                                        {getFileIcon(replyMessage.fileType)}
                                        <div className="flex flex-col">
                                            <p className="text-[12px] font-bold">{replyMessage.fileName}</p>
                                            <p className="text-[12px] text-gray-500 pt-1">{replyMessage.fileSize}</p>
                                        </div>
                                    </div>
                                ) : replyMessage.type === 'image' ? (
                                    <img src={replyMessage.content} alt="content" className="max-w-[50px] rounded-lg" />
                                ) : replyMessage.type === 'gif' ? (
                                    <img src={replyMessage.content} alt="GIF" className="max-w-[50px] rounded-lg " />
                                ) : replyMessage.type === 'sticker' ? (
                                    <img src={replyMessage.content} alt="GIF" className="max-w-[50px] rounded-lg " />
                                ) : (
                                    replyMessage.content
                                )}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {message.content}

            <p
                className={`absolute left-[8px] ${
                    reactions.length > 0 ? 'bottom-[15px]' : 'bottom-[5px]'
                } text-gray-500 text-[10px]`}
            >
                {new Date(message.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </p>
        </div>
    );
}

export default ChatText;
