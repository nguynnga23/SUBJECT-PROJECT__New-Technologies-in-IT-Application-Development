import { IoIosArrowDropdown, IoIosArrowDropright } from 'react-icons/io';
import { MdFilePresent } from 'react-icons/md';

import { VscFilePdf } from 'react-icons/vsc';
import { FaRegFileWord } from 'react-icons/fa';
import { FaRegFileExcel } from 'react-icons/fa';
import { FaRegFilePowerpoint } from 'react-icons/fa';

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

const Archive = ({ title, isOpen, toggleOpen, messages, type }) => {
    return (
        <div className="p-2 border-b-[7px] cursor-pointer">
            <div className="flex justify-between items-center pl-2" onClick={toggleOpen}>
                <span className="font-medium text-base">{title}</span>
                {isOpen ? (
                    <IoIosArrowDropdown className="font-medium text-base text-gray-400" />
                ) : (
                    <IoIosArrowDropright className="font-medium text-base text-gray-400" />
                )}
            </div>
            {isOpen && (
                <div className="flex flex-wrap p-1 gap-2">
                    {messages
                        .filter((msg) => msg.type === type)
                        .map((msg, index) => {
                            if (type === 'image') {
                                return (
                                    <img
                                        key={index}
                                        src={msg.content}
                                        className="w-[75px] h-[75px] rounded-lg object-cover border"
                                    />
                                );
                            } else if (type === 'file') {
                                return (
                                    <div className="w-full flex">
                                        <a
                                            href={msg.content}
                                            download={msg.content}
                                            className="hover:underline text-blue-500 text-sm flex"
                                        >
                                            {getFileIcon(msg.fileType)}
                                            <div>
                                                <p className="text-[12px] font-bold max-w-[290px] truncate">
                                                    {msg.fileName}
                                                </p>
                                                <p className="text-[12px] text-gray-500 pt-1">{msg.fileSize}</p>
                                            </div>
                                        </a>
                                    </div>
                                );
                            }
                        })}
                </div>
            )}
        </div>
    );
};

export default Archive;
