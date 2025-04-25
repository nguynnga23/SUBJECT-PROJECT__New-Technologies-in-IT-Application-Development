import { IoIosArrowDropdown, IoIosArrowDropright } from 'react-icons/io';
import { MdFilePresent } from 'react-icons/md';
import { FaRegFileAlt } from 'react-icons/fa';
import PopupViewImage from '../Popup/PopupViewImage';
import { VscFilePdf } from 'react-icons/vsc';
import { FaRegFileWord } from 'react-icons/fa';
import { FaRegFileExcel } from 'react-icons/fa';
import { FaRegFilePowerpoint } from 'react-icons/fa';
import { MdOutlineLink } from 'react-icons/md';
import { useState } from 'react';
import { RiGroupLine } from 'react-icons/ri';
import { LuCopy } from 'react-icons/lu';
import { LuCopyCheck } from 'react-icons/lu';
import { useSelector, useDispatch } from 'react-redux';
import { showModal, hideModal, toggleModal } from '../../redux/slices/modalSlice';

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

const Archive = ({ title, isOpen, toggleOpen, messages, type, group, setActiveMessageTab }) => {
    const userActive = useSelector((state) => state.auth.userActive);
    const userId = userActive.id;
    const [selectedImage, setSelectedImage] = useState(null);

    const dispatch = useDispatch();

    // link to invite group
    const [copied, setCopied] = useState(false);
    const link = group?.[0]?.chatId ? `http://localhost:3000/invite/${group[0].chatId}` : 'Link không khả dụng';

    const handleCopy = (e) => {
        e.stopPropagation(); // Ngăn click lan ra div cha
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="p-2 relative border-b-[7px] dark:border-b-gray-900 cursor-pointer">
            <div className="flex justify-between items-center pl-2" onClick={toggleOpen}>
                <span className="font-medium text-base">{title}</span>
                {isOpen ? (
                    <IoIosArrowDropdown className="font-medium text-base text-gray-400" />
                ) : (
                    <IoIosArrowDropright className="font-medium text-base text-gray-400" />
                )}
            </div>
            {isOpen && type === 'member' && (
                <div
                    className="w-full p-1 flex items-center hover:bg-gray-100 hover:dark:bg-gray-700"
                    onClick={() => setActiveMessageTab('infoGroup')}
                >
                    <RiGroupLine size={16} className="m-2" />
                    <p className="text-[12px]">{group.length} thành viên</p>
                </div>
            )}
            {isOpen && type === 'groupNews' && (
                <div
                    className="w-full p-1 flex items-center hover:bg-gray-100 hover:dark:bg-gray-700"
                    onClick={() => dispatch(toggleModal())}
                >
                    <FaRegFileAlt size={16} className="m-2" />
                    <p className="text-[12px]">Ghi chú, ghim, bình chọn</p>
                </div>
            )}
            {isOpen && type === 'invite' && (
                <div
                    className="w-full p-1 flex items-center justify-between hover:bg-gray-100 hover:dark:bg-gray-700"
                    onClick={() => console.log('invite')}
                >
                    <div className="flex items-center">
                        <MdOutlineLink size={16} className="m-2" />
                        <p className="text-[12px]">{link}</p>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                        title="Copy link"
                    >
                        {!copied && <LuCopy size={16} />}
                    </button>
                    {copied && <LuCopyCheck size={16} />}
                </div>
            )}
            {isOpen && (
                <div className="flex flex-wrap p-1 gap-2">
                    {messages
                        ?.filter((msg) => msg.type === type && !msg.deletedBy.some((m) => m === userId))
                        .map((msg, index) => {
                            if (type === 'image') {
                                return (
                                    <img
                                        key={index}
                                        alt="content"
                                        src={msg.content}
                                        className="w-[75px] h-[75px] rounded-lg object-cover border"
                                        onClick={() => setSelectedImage(msg.content)}
                                    />
                                );
                            } else if (type === 'file') {
                                return (
                                    <div className="w-full flex ">
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
                            return null;
                        })}
                </div>
            )}
            {selectedImage && <PopupViewImage selectedImage={selectedImage} setSelectedImage={setSelectedImage} />}
        </div>
    );
};

export default Archive;
