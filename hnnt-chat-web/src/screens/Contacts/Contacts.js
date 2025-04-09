import { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { RiUserAddLine } from 'react-icons/ri';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { PiUserList } from 'react-icons/pi';
import { GoPeople } from 'react-icons/go';
import { PiUserPlus } from 'react-icons/pi';
import { TiDelete } from 'react-icons/ti';

import avatar from '../../public/avatar_sample.jpg';
import groupzalo from '../../public/groupzalo.png';

import { useSelector } from 'react-redux';

import TabFriendsList from '../../components/Tab/TabFriendsList';
import TabGroupList from '../../components/Tab/TabGroupList';
import TabFriendRequest from '../../components/Tab/TabFriendRequest';
import PopupAddFriend from '../../components/Popup/PopupAddFriend';
import PopupAddGroup from '../../components/Popup/PopupAddGroup';
import { searchFollowKeyWord } from '../Messaging/api';
import { getListFriendByKeyword } from './api';
import TabSearch from '../../components/Tab/TabSearch';
import TabChat from '../../components/Tab/TabChat';

const TabsContacts = [
    { id: 1, icon: <PiUserList size={25} />, title: 'Danh sách bạn bè', content: 'Bạn bè' },
    { id: 2, icon: <GoPeople size={25} />, title: 'Danh sách nhóm và cộng đồng', content: 'Nhóm và cộng đồng' },
    { id: 3, icon: <PiUserPlus size={25} />, title: 'Lời mời kết bạn', content: 'Lời mời đã nhận' },
    { id: 4, icon: <AiOutlineUsergroupAdd size={25} />, title: 'Lời mời vào nhóm cộng đồng' },
];

const userdata = [
    { id: 3, name: 'Nga Nguyễn', avatar: avatar },
    { id: 4, name: 'Huyền Trang', avatar: avatar },
    { id: 1, name: 'Anh Huy', avatar: avatar },
    { id: 2, name: 'Anh Tài', avatar: avatar },
];

const groupData = [
    {
        id: 1,
        name: 'Công nghệ mới HK2-4',
        members: [
            { id: 3, name: 'Nga Nguyễn', avatar: avatar },
            { id: 4, name: 'Huyền Trang', avatar: avatar },
            { id: 1, name: 'Anh Huy', avatar: avatar },
            { id: 2, name: 'Anh Tài', avatar: avatar },
            { id: 4, name: 'Bảo Khánh', avatar: avatar },
            { id: 5, name: 'Quang Huy', avatar: avatar },
        ],
    },
    {
        id: 2,
        name: 'Code Warriors',
        members: [
            { id: 1, name: 'Minh Tú', avatar: avatar },
            { id: 2, name: 'Lan Phương', avatar: avatar },
            { id: 3, name: 'Phương Linh', avatar: avatar },
            { id: 4, name: 'Tuấn Anh', avatar: avatar },
            { id: 5, name: 'Duy Khang', avatar: avatar },
        ],
    },
    {
        id: 3,
        name: 'Debuggers United',
        members: [{ id: 1, name: 'Hoàng Yến', avatar: avatar }],
    },
    {
        id: 4,
        name: 'Byte Busters',
        members: [
            { id: 1, name: 'Khánh Vy', avatar: avatar },
            { id: 2, name: 'Mai Anh', avatar: avatar },
            { id: 3, name: 'Đức Phúc', avatar: avatar },
        ],
    },
    {
        id: 5,
        name: 'Tech Titans',
        members: [
            { id: 3, name: 'Thanh Trúc', avatar: avatar },
            { id: 4, name: 'Bảo Ngọc', avatar: avatar },
            { id: 1, name: 'Hữu Nghĩa', avatar: avatar },
            { id: 2, name: 'Minh Quân', avatar: avatar },
            { id: 5, name: 'Gia Bảo', avatar: avatar },
        ],
    },
    {
        id: 6,
        name: 'Algorithm Masters',
        members: [
            { id: 1, name: 'Hồng Phúc', avatar: avatar },
            { id: 2, name: 'Hồng Quân', avatar: avatar },
        ],
    },
];

const friendRequestData = [
    { id: 1, name: 'Minh Tú', avatar: avatar, time: '1/2' },
    { id: 2, name: 'Lan Phương', avatar: avatar, time: '3/2' },
    { id: 3, name: 'Đức Anh', avatar: avatar, time: '4/6' },
    { id: 4, name: 'Thanh Trúc', avatar: avatar, time: '21/1' },
    { id: 5, name: 'Hoàng Yến', avatar: avatar, time: '' },
    { id: 6, name: 'Hữu Nghĩa', avatar: avatar, time: '' },
    { id: 7, name: 'Bảo Ngọc', avatar: avatar, time: '' },
    { id: 8, name: 'Duy Khang', avatar: avatar, time: '' },
];

function Contacts() {
    const [addFriendButton, setAddFriendButton] = useState(false);
    const [addGroupButton, setAddGroupButton] = useState(false);

    const [selectTab, setSelectTab] = useState(TabsContacts[0]);
    const [subSearch, setSubSearch] = useState('');
    const [search, setSearch] = useState('');
    const [filterName, setFilterName] = useState('AZ');
    const [filter, setFilter] = useState('Tất cả');

    const [data, setData] = useState([]);
    const [dataContact, setDataContact] = useState([]);

    // Tab danh sách bạn bè ----------------------------
    // Lọc dữ liệu theo tên
    const filteredData = userdata.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()));

    // chia đa ta theo chữ cái đầu tiên
    const groupedData = filteredData.reduce((acc, user) => {
        const firstLetter = user.name.charAt(0).toUpperCase();
        acc[firstLetter] = acc[firstLetter] || [];
        acc[firstLetter].push(user);
        return acc;
    }, {});

    // Sắp xếp theo bảng chữ cái
    const sortedGroupedData = Object.keys(groupedData)
        .sort((a, b) => (filterName === 'AZ' ? a.localeCompare(b) : b.localeCompare(a)))
        .reduce((acc, key) => {
            acc[key] = groupedData[key];
            return acc;
        }, {});
    //---------------------------------------------------

    // Tab danh sách nhóm và cộng đồng ------------------
    // search group by name
    const filteredGroups = groupData.filter((group) => group.name.toLowerCase().includes(search.toLowerCase()));

    // Sắp xếp theo bảng chữ cái
    const sortGroupsByName = () => {
        return [...filteredGroups].sort((a, b) =>
            filterName === 'AZ' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
        );
    };

    // test dropdown
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isOpenManageCategory, setIsOpenManageCategory] = useState(false);
    const categories = useSelector((state) => state.category.categories);

    // Đóng dropdown khi click ra ngoài
    const dropdownRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Chức năng search
    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (subSearch.trim()) {
                try {
                    const response1 = await searchFollowKeyWord(subSearch);
                    const response2 = await getListFriendByKeyword(subSearch);
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
    }, [subSearch]);

    return (
        <div className="h-screen flex flex-col">
            <div className="flex-1 flex min-h-0">
                <div className="w-1/4 bg-white dark:bg-gray-800 border-r p-4 dark:text-white">
                    <div className="flex justify-between items-center relative pb-2">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="w-full pl-8 pr-6 p-1.5 border bg-gray-200 dark:bg-gray-700 rounded-lg text-[14px] focus:border-blue-500 focus:outline-none"
                            value={subSearch}
                            onChange={(e) => setSubSearch(e.target.value)}
                        />
                        <FaSearch className="absolute left-2 top-3 text-gray-500 text-xs" />
                        {subSearch !== '' && (
                            <TiDelete
                                className="absolute right-[70px] top-3 text-gray-500 dark:text-gray-100 text-xs cursor-pointer bg-gray-200 dark:bg-gray-700"
                                size={16}
                                onClick={() => {
                                    setSubSearch('');
                                }}
                            />
                        )}
                        <div className="pl-3">
                            <RiUserAddLine size={20} onClick={() => setAddFriendButton(true)} />
                            <PopupAddFriend isOpen={addFriendButton} onClose={() => setAddFriendButton(false)} />
                        </div>
                        <div className="pl-3">
                            <AiOutlineUsergroupAdd size={20} onClick={() => setAddGroupButton(true)} />
                            <PopupAddGroup isOpen={addGroupButton} onClose={() => setAddGroupButton(false)} />
                        </div>
                    </div>
                    {subSearch !== '' ? (
                        <TabSearch keyword={subSearch} data={data} dataContact={dataContact} />
                    ) : (
                        <div>
                            {TabsContacts.map((tab) => (
                                <div
                                    key={tab.id}
                                    className={`p-3 cursor-pointer flex ${
                                        selectTab?.id === tab.id ? 'bg-blue-100 dark:bg-gray-600' : ''
                                    }`}
                                    onClick={() => {
                                        setSelectTab(tab);
                                        setSearch('');
                                        setFilterName('AZ');
                                        setFilter('Tất cả');
                                    }}
                                >
                                    <h3 className="font-bold">{tab.icon}</h3>
                                    <p className="text-base font-semibold pl-3 text-gray-600 dark:text-gray-100">
                                        {tab.title}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="w-3/4 flex flex-col bg-white dark:bg-gray-800 dark:text-white">
                    <div className="p-4 border-b flex items-center">
                        {selectTab.icon}
                        <h3 className="font-semibold text-lg pl-3">{selectTab.title}</h3>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-200 dark:bg-gray-700">
                        <p className="bg-gray-200 dark:bg-gray-700 p-2 rounded-lg w-fit mb-2 font-semibold">
                            {selectTab.content}
                        </p>
                        {selectTab.id === 1 ? (
                            <TabFriendsList
                                search={search}
                                setSearch={setSearch}
                                filterName={filterName}
                                setFilterName={setFilterName}
                                filter={filter}
                                setFilter={setFilter}
                                setIsDropdownOpen={setIsDropdownOpen}
                                dropdownRef={dropdownRef}
                                sortedGroupedData={sortedGroupedData}
                                isDropdownOpen={isDropdownOpen}
                            />
                        ) : selectTab.id === 2 ? (
                            <TabGroupList
                                search={search}
                                setSearch={setSearch}
                                filterName={filterName}
                                setFilterName={setFilterName}
                                filter={filter}
                                setFilter={setFilter}
                                sortedGroupedData={sortedGroupedData}
                                sortGroupsByName={sortGroupsByName}
                                isDropdownOpen={isDropdownOpen}
                                setIsDropdownOpen={setIsDropdownOpen}
                                dropdownRef={dropdownRef}
                                isOpenManageCategory={isOpenManageCategory}
                                setIsOpenManageCategory={setIsOpenManageCategory}
                                categories={categories}
                            />
                        ) : selectTab.id === 3 ? (
                            <TabFriendRequest
                                friendResponsetData={friendRequestData}
                                friendRequestData={friendRequestData}
                            />
                        ) : selectTab.id === 4 ? (
                            <div className="w-full h-screen flex flex-col items-center justify-center text-center translate-y-[-20%]">
                                <img src={groupzalo} alt="avatar" className="w-28 h-w-28 object-cover" />
                                <p className="text-sm">Không có lời mời vào nhóm và cộng đồng</p>
                                <div className="flex">
                                    <p className="text-sm">Khi nào tôi nhận được lời mời?</p>
                                    <a
                                        href="https://help.zalo.me/huong-dan/chuyen-muc/tro-chuyen-nhom/khi-nao-ban-nhan-duoc-loi-moi-vao-nhom-va-cong-dong/?gidzl=-efa5wbOcYZvasqHhK-VAFgVRn-p6PWbjibdJUHEb2NYdZHAiKt68BBAOahd7i1qkSfZ76LdvSOEhrUR80"
                                        className="text-sm ml-1 text-blue-600 cursor-pointer hover:underline"
                                    >
                                        Tìm hiểu thêm
                                    </a>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contacts;
