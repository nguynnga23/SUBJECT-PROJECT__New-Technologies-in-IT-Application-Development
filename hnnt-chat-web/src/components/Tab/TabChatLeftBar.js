import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { RiUserAddLine } from 'react-icons/ri';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { TiDelete } from 'react-icons/ti';

import PopupAddFriend from '../../components/Popup/PopupAddFriend';
import PopupAddGroup from '../../components/Popup/PopupAddGroup';
import TabSearch from '../../components/Tab/TabSearch';

import { useDispatch } from 'react-redux';
import TabChat from './TabChat';
import { searchFollowKeyWord } from '../../screens/Messaging/api';
import { getListFriend, getListFriendByKeyword } from '../../screens/Contacts/api';

function TabChatLeftBar() {
    const [addFriendButton, setAddFriendButton] = useState(false);
    const [addGroupButton, setAddGroupButton] = useState(false);

    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [dataContact, setDataContact] = useState([]);

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (search.trim()) {
                try {
                    const response1 = await searchFollowKeyWord(search);
                    const response2 = await getListFriendByKeyword(search);
                    setData(response1.messages);
                    setDataContact(response2);
                } catch (error) {
                    console.error('Lỗi khi tìm kiếm:', error);
                }
            } else {
                setData([]);
                setDataContact([]);
            }
        }, 1000);

        return () => clearTimeout(delayDebounce);
    }, [search]);

    return (
        <div className="w-1/4 min-w-[340px] bg-white dark:bg-gray-800 border-r dark:border-r-black ">
            <div className="flex justify-between items-center relative p-4 pb-2">
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="w-full pl-8 pr-6 p-1.5 border bg-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-black rounded-lg text-[14px] focus:border-blue-500 focus:outline-none"
                    value={search}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value.startsWith(' ')) return;
                        setSearch(e.target.value);
                    }}
                />
                <FaSearch className="absolute left-6 top-7 text-gray-500 text-xs" />
                {search !== '' && (
                    <TiDelete
                        className="absolute right-[85px] top-6 text-gray-500 text-xs cursor-pointer bg-gray-200 dark:bg-gray-900"
                        size={16}
                        onClick={() => {
                            setSearch('');
                        }}
                    />
                )}
                <div className="pl-3">
                    <RiUserAddLine
                        size={20}
                        onClick={() => setAddFriendButton(true)}
                        className="dark:text-gray-300 cursor-pointer"
                    />
                    <PopupAddFriend isOpen={addFriendButton} onClose={() => setAddFriendButton(false)} />
                </div>
                <div className="pl-3">
                    <AiOutlineUsergroupAdd
                        size={20}
                        onClick={() => setAddGroupButton(true)}
                        className="dark:text-gray-300 cursor-pointer"
                    />
                    <PopupAddGroup isOpen={addGroupButton} onClose={() => setAddGroupButton(false)} />
                </div>
            </div>
            {/* Tabs */}
            {/* Tabs danh mục */}
            {search !== '' ? <TabSearch keyword={search} data={data} dataContact={dataContact} /> : <TabChat />}
        </div>
    );
}

export default TabChatLeftBar;
