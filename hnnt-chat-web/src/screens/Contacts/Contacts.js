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

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import avatar from '../../public/avatar_sample.jpg';

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

function Contacts() {
    const [selectTab, setSelectTab] = useState(TabsContacts[0]);
    const [search, setSearch] = useState('');
    const [filterName, setFilterName] = useState('AZ');
    const [filter, setFilter] = useState('all');

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
                                onClick={() => setSelectTab(tab)}
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
                            <div className="bg-white w-full rounded-lg">
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
                                            </Select>
                                        </div>
                                    </div>
                                </div>

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
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contacts;
