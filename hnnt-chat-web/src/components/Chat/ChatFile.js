import { MdFilePresent } from 'react-icons/md';
import { VscFilePdf } from 'react-icons/vsc';
import { FaRegFileWord } from 'react-icons/fa';
import { FaRegFileExcel } from 'react-icons/fa';
import { FaRegFilePowerpoint } from 'react-icons/fa';
import { FiDownload } from 'react-icons/fi';

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

function ChatFile({ userId, message, showName, replyMessage }) {
    return (
        <div
            className={`relative pb-2 p-3 border rounded-lg max-w-[500px] cursor-pointer ${
                message.sender.id === userId
                    ? 'bg-blue-100 dark:bg-[#20344c] border-blue-200 dark:border-blue-100'
                    : 'bg-white dark:bg-[#20344c] border-gray-200 dark:border-gray-800'
            }`}
        >
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

            <div className="flex items-center space-x-3 mb-4">
                {/* Nút tải file */}
                {message.fileType.toLowerCase().includes('video') ? (
                    <div className="p-2">
                        <video controls width="500" className="rounded shadow">
                            <source muted={false} src={message.content} type={message.fileType} />
                            Trình duyệt của bạn không hỗ trợ video.
                        </video>

                        <a
                            href={message.content}
                            download={message.fileName}
                            className="hover:underline text-blue-500 text-sm flex mt-1"
                        >
                            <FiDownload size={20} className="m-2" />
                            <div className="flex flex-col">
                                <p className="text-[12px] font-bold max-w-[350px] truncate">{message.fileName}</p>
                                <p className="text-[12px] text-gray-500 pt-1">{message.fileSize}</p>
                            </div>
                        </a>
                    </div>
                ) : (
                    <a
                        href={message.content}
                        download={message.fileName}
                        className="hover:underline text-blue-500 text-sm flex"
                    >
                        {/* Icon file */}
                        {getFileIcon(message.fileType, message.content)}
                        {/* Thông tin file */}
                        <div className="flex flex-col">
                            <p className="text-[12px] font-bold">{message.fileName}</p>
                            <p className="text-[12px] text-gray-500 pt-1">{message.fileSize}</p>
                        </div>
                    </a>
                )}
            </div>

            {/* Thời gian gửi */}
            <p className="absolute left-[8px] bottom-[10px] text-gray-500 text-[10px] mb-2">
                {new Date(message.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </p>
        </div>
    );
}

export default ChatFile;
