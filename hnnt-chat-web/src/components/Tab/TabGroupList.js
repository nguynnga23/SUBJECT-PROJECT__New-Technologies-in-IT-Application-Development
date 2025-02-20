import React from 'react';
import { Avatar, AvatarGroup, Select, MenuItem } from '@mui/material';
import { FaAngleRight } from 'react-icons/fa';
import { IoSwapVertical } from 'react-icons/io5';
import { MdCancel } from 'react-icons/md';
import { CiSearch, CiFilter } from 'react-icons/ci';
import avatar from '../../public/avatar_sample.jpg';
import searchzalo from '../../public/searchzalo.png';

import PopupCategoryContact from '../Popup/PopupCategoryContact';

function TabGroupList(props) {
    const {
        search,
        setSearch,
        filterName,
        setFilterName,
        filter,
        setFilter,
        sortedGroupedData,
        sortGroupsByName,
        isDropdownOpen,
        setIsDropdownOpen,
        dropdownRef,
    } = props;

    return (
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
                                '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
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
                                '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    border: 0,
                                },
                                maxHeight: '30px',
                            }}
                        >
                            <MenuItem value="Tất cả">Tất cả</MenuItem>
                            <MenuItem
                                value="Phân loại"
                                onClick={() => setIsDropdownOpen(true)}
                                className="relative"
                                ref={dropdownRef}
                            >
                                <div className="flex justify-between w-full">
                                    <p>Phân loại</p>
                                    <FaAngleRight />
                                </div>
                            </MenuItem>
                            <MenuItem value="Nhóm tôi quản lý">Nhóm tôi quản lý</MenuItem>
                            <MenuItem value="Cộng đồng tôi quản lý">Cộng đồng tôi quản lý</MenuItem>
                            <MenuItem sx={{ display: 'none' }} value={filter}>
                                {filter}
                            </MenuItem>
                        </Select>

                        {/* Dropdown hiển thị khi click */}
                        {isDropdownOpen && (
                            <PopupCategoryContact
                                setFilter={setFilter}
                                setIsDropdownOpen={setIsDropdownOpen}
                                isDropdownOpen={isDropdownOpen}
                                dropdownRef={dropdownRef}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* không tìm thấy */}
            {Array.isArray(sortGroupsByName()) && sortGroupsByName().length === 0 && (
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
                            <Avatar alt="Travis Howard" src={avatar} sx={{ width: 20, height: 20 }} />
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
    );
}

export default TabGroupList;
