import { MdFilePresent } from 'react-icons/md';
import { VscFilePdf } from 'react-icons/vsc';
import { FaRegFileWord } from 'react-icons/fa';
import { FaRegFileExcel } from 'react-icons/fa';
import { FaRegFilePowerpoint } from 'react-icons/fa';
import { BsChatText } from 'react-icons/bs';
import { useEffect, useRef } from 'react';

const PopupAllPinnedOfMessage = ({ pinnedMessages, setShowAllPinned, scrollToMessage }) => {
    const popupContainerRef = useRef(null);

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

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupContainerRef.current && !popupContainerRef.current.contains(event.target)) {
                setShowAllPinned(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setShowAllPinned]);

    return (
        <div
            className="absolute right-[10px] bg-gray-200 dark:bg-gray-800 p-1 rounded-lg w-96 max-h-[80vh] overflow-auto z-[1000]"
            ref={popupContainerRef}
        >
            <div className="space-y-1">
                {pinnedMessages.map((message, index) => (
                    <div className="relative">
                        <p className="absolute text-red-500 text-[7px] right-[5px] top-[5px] p-1 cursor-pointer hover:bg-red-500 hover:text-white border rounded-lg">
                            Bỏ ghim
                        </p>

                        <div
                            key={index}
                            className=" p-1.5 text-[10px] flex dark:bg-gray-700 bg-white rounded-lg shadow cursor-pointer items-center hover:bg-gray-300"
                            onClick={() => {
                                scrollToMessage(message.id);
                                setShowAllPinned(false);
                            }}
                        >
                            <BsChatText size={20} className="text-blue-500 m-1" />
                            <div className="ml-1">
                                <p>Tin nhắn</p>
                                <div className="flex items-center max-w-[300px] truncate">
                                    <p className="font-medium text-gray-600 dark:text-gray-300 mr-2">
                                        {message.sender?.name}:
                                    </p>
                                    {message.type === 'file' ? (
                                        <div className="flex items-center">
                                            {getFileIcon(message.fileType)}
                                            <div className="flex flex-col">
                                                <p className="text-[12px] font-bold">{message.fileName}</p>
                                                <p className="text-[12px] text-gray-500 dark:text-gray-300 pt-1">
                                                    {message.fileSize}
                                                </p>
                                            </div>
                                        </div>
                                    ) : message.type === 'image' ? (
                                        <img src={message.content} alt="content" className="max-w-[80px] rounded-lg" />
                                    ) : message.type === 'gif' ? (
                                        <img src={message.content} alt="GIF" className="max-w-[80px] rounded-lg" />
                                    ) : message.type === 'sticker' ? (
                                        <img src={message.content} alt="GIF" className="max-w-[50px] rounded-lg" />
                                    ) : (
                                        message.content
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PopupAllPinnedOfMessage;
