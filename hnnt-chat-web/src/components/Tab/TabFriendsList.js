import { Select, MenuItem } from '@mui/material';
import { CiSearch, CiFilter } from 'react-icons/ci';
import { IoSwapVertical } from 'react-icons/io5';
import { MdCancel } from 'react-icons/md';
import { FaAngleRight } from 'react-icons/fa';
import searchzalo from '../../public/searchzalo.png';
import PopupCategoryContact from '../Popup/PopupCategoryContact';

function TabFriendsList(props) {
    const {
        search,
        setFilter,
        setSearch,
        filterName,
        setFilterName,
        filter,
        setIsDropdownOpen,
        dropdownRef,
        isDropdownOpen,
        sortedGroupedData,
    } = props;

    return (
        <div className="bg-white dark:bg-gray-800 w-full rounded-lg relative">
            <div className="p-4">
                <div className="flex">
                    <div className="w-1/2 flex items-center group hover:bg-gray-100 dark:hover:bg-gray-600 p-1 rounded-lg border-2 focus-within:border-blue-400">
                        <CiSearch size={20} />
                        <input
                            type="text"
                            placeholder="Tìm bạn"
                            className="w-full group-hover:bg-gray-100 dark:group-hover:bg-gray-600 dark:bg-gray-800 border-none outline-none p-1 placeholder:text-sm"
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

                    <div className="w-1/4 flex items-center group hover:bg-gray-100 dark:hover:bg-gray-600 p-1 rounded-lg border-2 focus-within:border-blue-400 text-gray-500 ml-2">
                        <IoSwapVertical size={20} />
                        <Select
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                            className="border-none outline-none p-1 w-full group-hover:bg-gray-100 dark:group-hover:bg-gray-600 dark:bg-gray-800"
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
                                '.MuiSelect-select': {
                                    fontSize: '14px',
                                },
                            }}
                        >
                            <MenuItem value="AZ" sx={{ fontSize: '14px' }}>
                                Tên (A-Z)
                            </MenuItem>
                            <MenuItem value="ZA" sx={{ fontSize: '14px' }}>
                                Tên (Z-A)
                            </MenuItem>
                        </Select>
                    </div>

                    <div className="relative w-1/4 flex items-center group hover:bg-gray-100 dark:hover:bg-gray-600 p-1 rounded-lg border-2 focus-within:border-blue-400 text-gray-500 ml-2">
                        <CiFilter size={20} />
                        <Select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="border-none outline-none p-1 w-full group-hover:bg-gray-100 dark:group-hover:bg-gray-600 dark:bg-gray-800"
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
                                '.MuiSelect-select': {
                                    fontSize: '14px',
                                },
                            }}
                        >
                            <MenuItem value="Tất cả" sx={{ fontSize: '14px' }}>
                                Tất cả
                            </MenuItem>
                            <MenuItem
                                sx={{ fontSize: '14px' }}
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

            {Object.keys(sortedGroupedData).length === 0 && (
                <div className="w-full mt-10 pb-10 flex flex-col items-center justify-center text-center">
                    <img src={searchzalo} alt="searchzalo" className="w-36 h-w-36" />
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
                                className="flex items-center space-x-2 mt-3 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 py-2"
                            >
                                <img src={user.avatar} alt="avatar" className="w-12 h-12 rounded-full" />
                                <h4 className="text-sm font-medium">{user.name}</h4>
                            </div>
                            {index !== users.length - 1 && (
                                <div className="w-full bg-gray-200 dark:hover:bg-gray-700 h-[1px] mt-2 pl-4"></div>
                            )}
                        </>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default TabFriendsList;
