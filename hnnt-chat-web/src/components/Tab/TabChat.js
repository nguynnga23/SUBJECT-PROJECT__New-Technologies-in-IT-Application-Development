import { useState } from 'react';
import { IoMdSend } from 'react-icons/io';
import { BsThreeDots } from 'react-icons/bs';
import { FaRegSmile } from 'react-icons/fa';
import { MdLabelOutline } from 'react-icons/md';
import { VscLayoutSidebarRightOff } from 'react-icons/vsc';
import { VscLayoutSidebarRight } from 'react-icons/vsc';
import { BsTelephone } from 'react-icons/bs';
import { GoDeviceCameraVideo } from 'react-icons/go';
import { IoSearchOutline } from 'react-icons/io5';

import PopupCategory from '../Popup/PopupCategory';

function TabChat({ selectedChat, showRightBar, setShowRightBar, showRightBarSearch, setShowRightBarSearch }) {
    const [message, setMessage] = useState('');
    const [isOpenCategory, setIsOpenCategory] = useState(false);

    const toggleSearch = () => {
        setShowRightBarSearch(!showRightBarSearch);
        setShowRightBar(false); // Tắt sidebar khi search mở
    };

    const toggleSidebar = () => {
        setShowRightBar(!showRightBar);
        setShowRightBarSearch(false); // Tắt search khi sidebar mở
    };

    return (
        <>
            <div className="p-2 border-b flex justify-between items-center">
                <div className="flex justify-center">
                    <img
                        src={selectedChat.avatar} // Thay bằng avatar thật
                        className="w-[45px] h-[45px] rounded-full border mr-2 object-cover"
                    />
                    <div>
                        <h3 className="font-medium text-base text-lg">{selectedChat.name}</h3>
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
                        onClick={toggleSearch}
                    />

                    {showRightBar ? (
                        <VscLayoutSidebarRight
                            size={26}
                            className="ml-1.5 text-blue-500 bg-blue-200 p-1 rounded-[5px] cursor-pointer"
                            onClick={toggleSidebar}
                        />
                    ) : (
                        <VscLayoutSidebarRightOff
                            size={26}
                            className="ml-1.5 text-gray-700 p-1 hover:text-gray-500 hover:bg-gray-200"
                            onClick={toggleSidebar}
                        />
                    )}
                </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                <p className="bg-gray-200 p-2 rounded-lg w-fit mb-2">{selectedChat.message}</p>
            </div>
            <div className="p-4 flex items-center border-t">
                <FaRegSmile className="text-2xl cursor-pointer mr-3" />
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 p-2 border rounded-lg focus:border-blue-500 focus:outline-none"
                />
                <IoMdSend className="text-2xl cursor-pointer ml-3 text-blue-500" />
            </div>
        </>
    );
}

export default TabChat;
