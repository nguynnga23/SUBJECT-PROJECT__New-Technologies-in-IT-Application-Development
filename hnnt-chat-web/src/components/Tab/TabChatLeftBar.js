import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { RiUserAddLine } from 'react-icons/ri';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { TiDelete } from 'react-icons/ti';

import PopupAddFriend from '../../components/Popup/PopupAddFriend';
import PopupAddGroup from '../../components/Popup/PopupAddGroup';
import TabSearch from '../../components/Tab/TabSearch';
import TabMesssage from '../../components/Tab/TabMessage';

function TabChatLeftBar({ selectedChat, setSelectedChat }) {
    const [activeTab, setActiveTab] = useState('priority');
    const [addFriendButton, setAddFriendButton] = useState(false);
    const [addGroupButton, setAddGroupButton] = useState(false);

    const [search, setSearch] = useState('');

    return (
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
    );
}

export default TabChatLeftBar;
