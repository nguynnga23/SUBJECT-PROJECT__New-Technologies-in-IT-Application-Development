import { useState, useRef } from 'react';
import { IoMdSend } from 'react-icons/io';
import { MdLabelOutline } from 'react-icons/md';
import { VscLayoutSidebarRightOff } from 'react-icons/vsc';
import { VscLayoutSidebarRight } from 'react-icons/vsc';
import { BsTelephone } from 'react-icons/bs';
import { GoDeviceCameraVideo } from 'react-icons/go';
import { IoSearchOutline } from 'react-icons/io5';
import { AiFillLike } from 'react-icons/ai';
import { IoImageOutline } from 'react-icons/io5';
import { MdAttachFile } from 'react-icons/md';
import { FaRegAddressCard } from 'react-icons/fa6';

import PopupCategory from '../Popup/PopupCategory';

import { useDispatch, useSelector } from 'react-redux';
import { setShowOrOffRightBar, setShowOrOffRightBarSearch } from '../../redux/slices/chatSlice';

function TabChat() {
    const [message, setMessage] = useState('');
    const [isOpenCategory, setIsOpenCategory] = useState(false);

    const activeChat = useSelector((state) => state.chat.activeChat);

    const dispatch = useDispatch();
    const showRightBar = useSelector((state) => state.chat.showRightBar);
    const showRightBarSearch = useSelector((state) => state.chat.showRightBarSearch);

    const textareaRef = useRef(null);

    // Hàm tự động điều chỉnh chiều cao
    const adjustHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = '50px'; // Reset chiều cao trước khi tính toán
            const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
            textareaRef.current.style.height = `${newHeight}px`;
        }
    };

    return (
        <>
            <div className="p-2 border-b flex justify-between items-center h-[62px] min-w-[600px]">
                <div className="flex justify-center ">
                    <img
                        src={activeChat.avatar} // Thay bằng avatar thật
                        className="w-[45px] h-[45px] rounded-full border mr-2 object-cover"
                    />
                    <div>
                        <h3 className="font-medium text-base text-lg max-h-[28px]">{activeChat.name}</h3>
                        <MdLabelOutline
                            className="cursor-pointer"
                            color="gray"
                            onClick={() => setIsOpenCategory(!isOpenCategory)}
                        />
                    </div>
                    {isOpenCategory && <PopupCategory isOpen={isOpenCategory} setIsOpen={setIsOpenCategory} />}
                </div>
                <div className="p-2 flex">
                    <BsTelephone
                        size={26}
                        className="ml-1.5 p-1 hover:text-gray-500 hover:bg-gray-200  hover:rounded-[5px] cursor-pointer"
                    />
                    <GoDeviceCameraVideo
                        size={26}
                        className="ml-1.5 p-1 hover:text-gray-500 hover:bg-gray-200  hover:rounded-[5px] cursor-pointer"
                    />
                    <IoSearchOutline
                        size={26}
                        className={`ml-1.5 p-1 hover:text-gray-500 hover:bg-gray-200  hover:rounded-[5px] cursor-pointer ${
                            showRightBarSearch ? 'text-blue-500 bg-blue-200 rounded-[5px]' : ''
                        }`}
                        onClick={() => dispatch(setShowOrOffRightBarSearch(!showRightBarSearch))}
                    />

                    {showRightBar ? (
                        <VscLayoutSidebarRight
                            size={26}
                            className="ml-1.5 text-blue-500 bg-blue-200 p-1 rounded-[5px] cursor-pointer"
                            onClick={() => dispatch(setShowOrOffRightBar(!showRightBar))}
                        />
                    ) : (
                        <VscLayoutSidebarRightOff
                            size={26}
                            className="ml-1.5 text-gray-700 p-1 hover:text-gray-500 hover:rounded-[5px] hover:bg-gray-200 cursor-pointer"
                            onClick={() => dispatch(setShowOrOffRightBar(!showRightBar))}
                        />
                    )}
                </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-200">
                <p className="bg-blue-100 border border-blue-400 p-2 rounded-lg w-fit mb-2">{activeChat.message}</p>
            </div>
            <div>
                <div className="flex bg-white border-t p-2">
                    <IoImageOutline className="text-2xl cursor-pointer ml-5 hover:text-blue-500 text-gray-500" />
                    <MdAttachFile className="text-2xl cursor-pointer ml-5 hover:text-blue-500 text-gray-500" />
                    <FaRegAddressCard className="text-2xl cursor-pointer ml-5 hover:text-blue-500 text-gray-500" />
                </div>
                <div className="flex items-center border-t p-2">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                            adjustHeight();
                        }}
                        placeholder={`Nhập tin nhắn với ${activeChat.name}`}
                        className="flex-1 p-3 font-base text-[16px] rounded-lg focus:border-blue-500 focus:outline-none
                           h-[50px] max-h-[200px] overflow-y-auto resize-none"
                    />
                    <div className="flex items-center">
                        {message !== '' ? (
                            <IoMdSend className="text-2xl cursor-pointer ml-3 text-blue-500 mr-3" />
                        ) : (
                            <AiFillLike className="text-2xl cursor-pointer ml-3 text-yellow-500 mr-3" />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default TabChat;
