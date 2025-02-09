import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { RiUserAddLine } from 'react-icons/ri';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { TiDelete } from 'react-icons/ti';
import { FaTrashAlt } from 'react-icons/fa';

import PopupAddFriend from '../../components/Popup/PopupAddFriend';
import PopupAddGroup from '../../components/Popup/PopupAddGroup';
import TabSearch from '../../components/Tab/TabSearch';
import TabMesssage from '../../components/Tab/TabMessage';
import TabChat from '../../components/Tab/TabChat';

function Messaging() {
    const [selectedChat, setSelectedChat] = useState(null);
    const [activeTab, setActiveTab] = useState('priority');
    const [addFriendButton, setAddFriendButton] = useState(false);
    const [addGroupButton, setAddGroupButton] = useState(false);

    const [search, setSearch] = useState('');

    const [showRightBar, setShowRightBar] = useState(false);

    const [activeMessageTab, setActiveMessageTab] = useState('info');

    return (
        <div className="h-screen flex flex-col">
            <div className="flex-1 flex min-h-0 ">
                <div className="w-1/4 min-w-[340px] bg-white border-r p-4">
                    <div className="flex justify-between items-center  relative ">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="w-full pl-8 pr-8 p-1.5 border rounded-lg text-xs focus:border-blue-500 focus:outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <FaSearch className="absolute left-3 top-2 text-gray-500 text-xs" />
                        {search !== '' && (
                            <TiDelete
                                className="absolute right-16 top-2 text-gray-500 text-xs cursor-pointer bg-white"
                                size={16}
                                onClick={() => {
                                    setSearch('');
                                }}
                            />
                        )}
                        <div className="pl-2">
                            <RiUserAddLine size={20} onClick={() => setAddFriendButton(true)} />
                            <PopupAddFriend isOpen={addFriendButton} onClose={() => setAddFriendButton(false)} />
                        </div>
                        <div className="pl-2">
                            <AiOutlineUsergroupAdd size={20} onClick={() => setAddGroupButton(true)} />
                            <PopupAddGroup isOpen={addGroupButton} onClose={() => setAddGroupButton(false)} />
                        </div>
                    </div>
                    {/* Tabs */}
                    {/* Tabs danh mục */}
                    {search !== '' ? (
                        <TabSearch />
                    ) : (
                        <TabMesssage
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            selectedChat={selectedChat}
                            setSelectedChat={setSelectedChat}
                        />
                    )}
                </div>

                <div className={`flex flex-col bg-white ${showRightBar ? 'w-2/4' : 'w-3/4'}`}>
                    {selectedChat ? (
                        <TabChat
                            selectedChat={selectedChat}
                            showRightBar={showRightBar}
                            setShowRightBar={setShowRightBar}
                        />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            Chọn một cuộc trò chuyện để bắt đầu
                        </div>
                    )}
                </div>
                {showRightBar && (
                    <div className="w-1/4 flex flex-col bg-white min-w-[330px] border-l">
                        {/* Tabs */}
                        <div className="flex border-b">
                            <button
                                className={`flex-1 py-3.5 text-center font-medium ${
                                    activeMessageTab === 'info'
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500'
                                }`}
                                onClick={() => setActiveMessageTab('info')}
                            >
                                Thông tin
                            </button>
                            <button
                                className={`flex-1 py-2 text-center font-medium ${
                                    activeMessageTab === 'emoji'
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500'
                                }`}
                                onClick={() => setActiveMessageTab('emoji')}
                            >
                                Biểu tượng
                            </button>
                        </div>

                        {/* Nội dung */}
                        {activeMessageTab === 'info' && (
                            <div className="p-4">
                                {/* Avatar + Tên nhóm */}
                                <div className="flex flex-col items-center mb-4">
                                    <img
                                        src="" // Thay bằng avatar thật
                                        className="w-20 h-20 rounded-full border"
                                    />
                                    <h3 className="font-bold text-lg mt-2 font-bold">{selectedChat.name}</h3>
                                </div>

                                {/* Danh mục */}
                                <div className="space-y-2">
                                    <div className="p-2 border-b">
                                        <div className="flex justify-between items-center ">
                                            <span className=" font-bold cursor-pointer">Ảnh/Video</span>
                                            <span className=" font-bold">{'>'}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1 font-bold">
                                            Chưa có Ảnh/Video được chia sẻ trong hội thoại này
                                        </p>
                                    </div>
                                    <div className="p-2 border-b">
                                        <div className="flex justify-between items-center ">
                                            <span className="font-bold cursor-pointer">File</span>
                                            <span className=" font-bold">{'>'}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1 font-bold">
                                            Chưa có File được chia sẻ trong hội thoại này
                                        </p>
                                    </div>
                                    <div className="items-center p-2 border-b cursor-pointer">
                                        <div className="flex justify-between items-center ">
                                            <span className="text-gray-600 font-bold">Link</span>
                                            <span className="font-bold">{'>'}</span>
                                        </div>

                                        <p className="text-xs text-gray-400 mt-1 font-bold">
                                            Chưa có Link được chia sẻ trong hội thoại này
                                        </p>
                                    </div>
                                </div>

                                {/* Xóa lịch sử trò chuyện */}
                                <div className="mt-4 text-red-500 flex items-center space-x-2 cursor-pointer">
                                    <FaTrashAlt />
                                    <span>Xóa lịch sử trò chuyện</span>
                                </div>
                            </div>
                        )}

                        {activeTab === 'emoji' && <div className="p-4 text-gray-500 text-center">Tab Biểu tượng</div>}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Messaging;
