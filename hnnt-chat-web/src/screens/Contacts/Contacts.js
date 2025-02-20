import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { RiUserAddLine } from 'react-icons/ri';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { PiUserList } from 'react-icons/pi';
import { GoPeople } from 'react-icons/go';
import { PiUserPlus } from 'react-icons/pi';
import { CiSearch } from 'react-icons/ci';
import { MdCancel } from 'react-icons/md';
import { IoSwapVertical } from 'react-icons/io5';
import { CiFilter } from 'react-icons/ci';
import { FaAngleRight } from 'react-icons/fa6';
import { AiOutlineMessage } from 'react-icons/ai';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Tooltip from '@mui/material/Tooltip';

import avatar from '../../public/avatar_sample.jpg';
import groupzalo from '../../public/groupzalo.png';
import searchzalo from '../../public/searchzalo.png';

import PopupCategoryContact from '../../components/Popup/PopupCategoryContact';

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

const friendResponsetData = [
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
    const [selectTab, setSelectTab] = useState(TabsContacts[0]);
    const [search, setSearch] = useState('');
    const [filterName, setFilterName] = useState('AZ');
    const [filter, setFilter] = useState('all');

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

    return (
        <div className="h-screen flex flex-col">
            <div className="flex-1 flex min-h-0">
                <div className="w-1/4 bg-white border-r p-4">
                    <div className="flex justify-between items-center pb-4 border-b relative my-4">
                        <input type="text" placeholder="Tìm kiếm..." className="w-full pl-10 p-2 border rounded-lg" />
                        <FaSearch className="absolute left-3 top-3 text-gray-500" />
                        <div className="pl-2">
                            <RiUserAddLine size={24} />
                        </div>
                        <div className="pl-2">
                            <AiOutlineUsergroupAdd size={24} />
                        </div>
                    </div>
                    <div>
                        {TabsContacts.map((tab) => (
                            <div
                                key={tab.id}
                                className={`p-3 cursor-pointer flex ${selectTab?.id === tab.id ? 'bg-blue-100' : ''}`}
                                onClick={() => {
                                    setSelectTab(tab);
                                    setSearch('');
                                    setFilterName('AZ');
                                    setFilter('all');
                                }}
                            >
                                <h3 className="font-bold">{tab.icon}</h3>
                                <p className="text-base font-semibold pl-3 text-gray-600">{tab.title}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-3/4 flex flex-col bg-white">
                    <div className="p-4 border-b flex items-center">
                        {selectTab.icon}
                        <h3 className="font-semibold text-lg pl-3">{selectTab.title}</h3>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-200">
                        <p className="bg-gray-200 p-2 rounded-lg w-fit mb-2 font-semibold">{selectTab.content}</p>
                        {selectTab.id === 1 ? (
                            <div className="bg-white w-full rounded-lg relative">
                                <div className="p-4">
                                    <div className="flex">
                                        <div className="w-1/2 flex items-center group hover:bg-gray-100 p-1 rounded-lg border-2 focus-within:border-blue-400">
                                            <CiSearch size={20} />
                                            <input
                                                type="text"
                                                placeholder="Tìm bạn"
                                                className="w-full group-hover:bg-gray-100 border-none outline-none p-1"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                            {search ? (
                                                <MdCancel
                                                    size={20}
                                                    className="text-gray-500 hover:text-blue-600"
                                                    onClick={() => setSearch('')}
                                                />
                                            ) : null}
                                        </div>

                                        <div className="w-1/4 flex items-center group hover:bg-gray-100 p-1 rounded-lg border-2 focus-within:border-blue-400 text-gray-500 ml-2">
                                            <IoSwapVertical size={20} />
                                            <Select
                                                value={filterName}
                                                onChange={(e) => setFilterName(e.target.value)}
                                                className="border-none outline-none p-1 w-full group-hover:bg-gray-100 "
                                                sx={{
                                                    boxShadow: 'none',
                                                    color: 'gray',
                                                    '.MuiOutlinedInput-notchedOutline': { border: 0 },
                                                    '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                                                        border: 0,
                                                    },
                                                    '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                                                        {
                                                            border: 0,
                                                        },
                                                    maxHeight: '30px',
                                                }}
                                            >
                                                <MenuItem value="AZ">Tên (A-Z)</MenuItem>
                                                <MenuItem value="ZA">Tên (Z-A)</MenuItem>
                                            </Select>
                                        </div>

                                        <div className="relative w-1/4 flex items-center group hover:bg-gray-100 p-1 rounded-lg border-2 focus-within:border-blue-400 text-gray-500 ml-2">
                                            <CiFilter size={20} />
                                            <Select
                                                value={filter}
                                                onChange={(e) => setFilter(e.target.value)}
                                                className="border-none outline-none p-1 w-full group-hover:bg-gray-100 "
                                                sx={{
                                                    boxShadow: 'none',
                                                    color: 'gray',
                                                    '.MuiOutlinedInput-notchedOutline': { border: 0 },
                                                    '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                                                        border: 0,
                                                    },
                                                    '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                                                        {
                                                            border: 0,
                                                        },
                                                    maxHeight: '30px',
                                                }}
                                            >
                                                <MenuItem value="all">Tất cả</MenuItem>
                                                {/* <MenuItem value="phanloai">
                                                    <div className="flex justify-between w-full">
                                                        <p>Phân loại</p>
                                                        
                                                        <FaAngleRight />
                                                    </div>
                                                </MenuItem> */}
                                                <div className="absolute top-10 right-0">
                                                    <PopupCategoryContact />
                                                </div>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {Object.keys(sortedGroupedData).length === 0 && (
                                    <div className="w-full mt-10 pb-10 flex flex-col items-center justify-center text-center">
                                        <img src={searchzalo} className="w-36 h-w-36" />
                                        <p className="text-sm font-semibold">Không tìm thấy kết quả</p>
                                        <p className="text-sm mt-2">Vui lòng thử lại từ khóa hoặc bộ lọc khác</p>
                                    </div>
                                )}

                                {Object.entries(sortedGroupedData).map(([key, users]) => (
                                    <div key={key} className="mt-4">
                                        <h4 className="text-lg font-medium px-4">{key}</h4>
                                        {users.map((user, index) => (
                                            <>
                                                <div
                                                    key={user.id}
                                                    className="flex items-center space-x-2 mt-3 px-4 cursor-pointer hover:bg-gray-100 py-2"
                                                >
                                                    <img src={user.avatar} className="w-12 h-12 rounded-full" />
                                                    <h4 className="text-sm font-medium">{user.name}</h4>
                                                </div>
                                                {index !== users.length - 1 && (
                                                    <div className="w-full bg-gray-200 h-[1px] mt-2 pl-4"></div>
                                                )}
                                            </>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ) : selectTab.id === 2 ? (
                            <div className="bg-white w-full rounded-lg">
                                <div className="p-4">
                                    <div className="flex">
                                        <div className="w-1/2 flex items-center group hover:bg-gray-100 p-1 rounded-lg border-2 focus-within:border-blue-400">
                                            <CiSearch size={20} />
                                            <input
                                                type="text"
                                                placeholder="Tìm kiếm..."
                                                className="w-full group-hover:bg-gray-100 border-none outline-none p-1"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                            {search ? (
                                                <MdCancel
                                                    size={20}
                                                    className="text-gray-500 hover:text-blue-600"
                                                    onClick={() => setSearch('')}
                                                />
                                            ) : null}
                                        </div>

                                        <div className="w-1/4 flex items-center group hover:bg-gray-100 p-1 rounded-lg border-2 focus-within:border-blue-400 text-gray-500 ml-2">
                                            <IoSwapVertical size={20} />
                                            <Select
                                                value={filterName}
                                                onChange={(e) => setFilterName(e.target.value)}
                                                className="border-none outline-none p-1 w-full group-hover:bg-gray-100 "
                                                sx={{
                                                    boxShadow: 'none',
                                                    color: 'gray',
                                                    '.MuiOutlinedInput-notchedOutline': { border: 0 },
                                                    '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                                                        border: 0,
                                                    },
                                                    '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                                                        {
                                                            border: 0,
                                                        },
                                                    maxHeight: '30px',
                                                }}
                                            >
                                                <MenuItem value="AZ">Tên (A-Z)</MenuItem>
                                                <MenuItem value="ZA">Tên (Z-A)</MenuItem>
                                                <MenuItem value="MC">Hoạt động (mới→cũ)</MenuItem>
                                                <MenuItem value="CM">Hoạt động (cũ→mới)</MenuItem>
                                            </Select>
                                        </div>

                                        <div className="w-1/4 flex items-center group hover:bg-gray-100 p-1 rounded-lg border-2 focus-within:border-blue-400 text-gray-500 ml-2">
                                            <CiFilter size={20} />
                                            <Select
                                                value={filter}
                                                onChange={(e) => setFilter(e.target.value)}
                                                className="border-none outline-none p-1 w-full group-hover:bg-gray-100 "
                                                sx={{
                                                    boxShadow: 'none',
                                                    color: 'gray',
                                                    '.MuiOutlinedInput-notchedOutline': { border: 0 },
                                                    '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                                                        border: 0,
                                                    },
                                                    '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                                                        {
                                                            border: 0,
                                                        },
                                                    maxHeight: '30px',
                                                }}
                                            >
                                                <MenuItem value="all">Tất cả</MenuItem>
                                                <MenuItem value="phanloai">
                                                    <div className="flex justify-between w-full">
                                                        <p>Phân loại</p>
                                                        <FaAngleRight />
                                                    </div>
                                                </MenuItem>
                                                <MenuItem value="NTQL">Nhóm tôi quản lý</MenuItem>
                                                <MenuItem value="CDTQL">Cộng đồng tôi quản lý</MenuItem>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {/* không tìm thấy */}
                                {Object.keys(sortedGroupedData).length === 0 && (
                                    <div className="w-full mt-10 pb-10 flex flex-col items-center justify-center text-center">
                                        <img src={searchzalo} className="w-36 h-w-36" />
                                        <p className="text-sm font-semibold">Không tìm thấy kết quả</p>
                                        <p className="text-sm mt-2">Vui lòng thử lại từ khóa hoặc bộ lọc khác</p>
                                    </div>
                                )}

                                {/* item trong danh sách nhóm */}

                                {sortGroupsByName().map((group, index) => (
                                    <div className="mt-4">
                                        <div className="flex items-center space-x-2 mt-3 px-4 cursor-pointer hover:bg-gray-100 py-2">
                                            <AvatarGroup
                                                total={group.members.length}
                                                sx={{ '& .MuiAvatar-root': { width: 20, height: 20, fontSize: 10 } }}
                                            >
                                                <Avatar alt="Remy Sharp" src={avatar} sx={{ width: 20, height: 20 }} />
                                                <Avatar
                                                    alt="Travis Howard"
                                                    src={avatar}
                                                    sx={{ width: 20, height: 20 }}
                                                />
                                            </AvatarGroup>
                                            <div>
                                                <h4 className="text-sm font-medium">{group.name}</h4>
                                                <p className="text-xs text-gray-500 hover:text-blue-500 hover:underline cursor-pointer">
                                                    {group.members.length} thành viên
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-200 h-[1px] mt-2 pl-4"></div>
                                    </div>
                                ))}
                            </div>
                        ) : selectTab.id === 3 ? (
                            <>
                                <div className="grid grid-cols-3 gap-4 justify-items-end">
                                    {friendResponsetData.map((user, index) => (
                                        <div key={index} className="bg-white rounded-lg w-full cursor-pointer h-fit">
                                            <div className="p-4 w-full">
                                                <div className="flex justify-center">
                                                    <img src={avatar} className="w-12 h-12 rounded-full" />
                                                    <div className="ml-3 mr-20">
                                                        <h4 className="text-sm font-medium">{user.name}</h4>
                                                        <p className="text-xs text-gray-500">
                                                            {user.time
                                                                ? `${user.time} - Từ số điện thoại`
                                                                : 'bạn đã nhận lời mời'}
                                                        </p>
                                                    </div>
                                                    <Tooltip
                                                        title="Nhắn tin"
                                                        arrow
                                                        componentsProps={{
                                                            tooltip: {
                                                                sx: {
                                                                    bgcolor: '#2e66b7',
                                                                    '& .MuiTooltip-arrow': {
                                                                        color: '#2e66b7',
                                                                    },
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        <AiOutlineMessage
                                                            className="cursor-pointer text-gray-500"
                                                            size={22}
                                                        />
                                                    </Tooltip>
                                                </div>
                                                <div className="bg-gray-200 border border-gray-300 p-2 mt-5 rounded-sm w-72">
                                                    <p className="text-sm">
                                                        Xin chào, mình là Nguyễn Nhật Huy. Kết bạn với mình nhé!
                                                    </p>
                                                </div>
                                                <div className="flex justify-between mt-6">
                                                    <button className="bg-gray-200 hover:bg-gray-300 text-black font-semibold w-full p-2 rounded-sm mr-2">
                                                        Từ chối
                                                    </button>
                                                    <button className="bg-blue-200 hover:bg-blue-300 text-blue-800 font-semibold w-full p-2 rounded-sm ml-2">
                                                        Đồng ý
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* lời mời đã gửi */}
                                <p className="text-base font-semibold pl-3 text-gray-600 my-5">Lời mời đã gửi</p>

                                <div className="grid grid-cols-3 gap-4 justify-items-end">
                                    {friendRequestData.map((user, index) => (
                                        <div
                                            key={index}
                                            className="bg-white rounded-lg p-4 cursor-pointer h-fit w-full"
                                        >
                                            <div className="p-4 w-full">
                                                <div className="flex justify-center">
                                                    <img src={avatar} className="w-12 h-12 rounded-full" />
                                                    <div className="ml-3 mr-20">
                                                        <h4 className="text-sm font-medium">{user.name}</h4>
                                                        <p className="text-xs text-gray-500">
                                                            {user.time || 'bạn đã gửi lời mời'}
                                                        </p>
                                                    </div>
                                                    <Tooltip
                                                        title="Nhắn tin"
                                                        arrow
                                                        componentsProps={{
                                                            tooltip: {
                                                                sx: {
                                                                    bgcolor: '#2e66b7',
                                                                    '& .MuiTooltip-arrow': {
                                                                        color: '#2e66b7',
                                                                    },
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        <AiOutlineMessage
                                                            className="cursor-pointer text-gray-500"
                                                            size={22}
                                                        />
                                                    </Tooltip>
                                                </div>

                                                <div className="flex justify-between mt-6">
                                                    <button className="bg-gray-200 hover:bg-gray-300 text-black font-semibold w-full p-2 rounded-sm mr-2">
                                                        Thu hồi lời mời
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : selectTab.id === 4 ? (
                            <div className="w-full h-screen flex flex-col items-center justify-center text-center translate-y-[-20%]">
                                <img src={groupzalo} className="w-28 h-w-28" />
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
