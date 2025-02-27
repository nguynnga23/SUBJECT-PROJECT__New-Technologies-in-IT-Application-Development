import { FiMoreHorizontal } from 'react-icons/fi';
import { MdFilePresent } from 'react-icons/md';
import PopupMenuForChat from '../Popup/PopupMenuForChat';
import { VscFilePdf } from 'react-icons/vsc';
import { FaRegFileWord } from 'react-icons/fa';
import { FaRegFileExcel } from 'react-icons/fa';
import { FaRegFilePowerpoint } from 'react-icons/fa';
import { AiOutlineLike } from 'react-icons/ai';
import PopupReacttion from '../Popup/PopupReaction';
import { useState } from 'react';
import PopupReactionChat from '../Popup/PopupReactionChat';

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

function ChatFile({ userId, message, showName }) {
    return (
        <div
            className={`relative pb-2 p-3 mb-2 border rounded-lg bg-gray-100 max-w-[500px] cursor-pointer ${
                message.sender === userId
                    ? 'bg-blue-100 dark:bg-[#20344c] border-blue-200 dark:border-blue-100'
                    : 'bg-white dark:bg-[#20344c] border-gray-200 dark:border-gray-800'
            }`}
        >
            {showName && (
                <p className="text-[10px] text-gray-400 pb-[2px]">{message?.sender !== userId && message?.name}</p>
            )}

            <div className="flex items-center space-x-3 mb-4">
                {/* Nút tải file */}
                <a
                    href={message.content}
                    download={message.fileName}
                    className="hover:underline text-blue-500 text-sm flex"
                >
                    {/* Icon file */}
                    {getFileIcon(message.fileType)}
                    {/* Thông tin file */}
                    <div className="flex flex-col">
                        <p className="text-[12px] font-bold">{message.fileName}</p>
                        <p className="text-[12px] text-gray-500 pt-1">{message.fileSize}</p>
                    </div>
                </a>
            </div>

            {/* Thời gian gửi */}
            <p className="absolute left-[8px] bottom-[10px] text-gray-500 text-[10px] mb-2">{message.time}</p>
        </div>
    );
}

export default ChatFile;
