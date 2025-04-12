import React from 'react';
import { AiOutlineMessage } from 'react-icons/ai';
import { Tooltip } from '@mui/material';
import avatar from '../../public/avatar_sample.jpg';

function TabFriendRequest(props) {
    const { friendResponsetData, friendRequestData } = props;

    return (
        <>
            <div className="grid grid-cols-3 gap-4 justify-items-end">
                {friendResponsetData.map((user, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg w-full cursor-pointer h-fit">
                        <div className="p-4 w-full">
                            <div className="flex justify-center">
                                <img src={avatar} alt="avatar" className="w-12 h-12 rounded-full" />
                                <div className="ml-3 mr-20">
                                    <h4 className="text-sm font-medium">{user.name}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-100">
                                        {user.time ? `${user.time} - Từ số điện thoại` : 'bạn đã nhận lời mời'}
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
                                    <AiOutlineMessage className="cursor-pointer text-gray-500" size={22} />
                                </Tooltip>
                            </div>
                            <div className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-900 p-2 mt-5 rounded-sm w-72">
                                <p className="text-sm">Xin chào, mình là Nguyễn Nhật Huy. Kết bạn với mình nhé!</p>
                            </div>
                            <div className="flex justify-between mt-6">
                                <button className="bg-gray-200 dark:bg-gray-500 hover:bg-gray-300 dark:hover:bg-gray-700 text-black dark:text-white font-semibold w-full p-2 rounded-sm mr-2">
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
            <p className="text-base font-semibold pl-3 text-gray-600 dark:text-gray-100 my-5">Lời mời đã gửi</p>

            <div className="grid grid-cols-3 gap-4 justify-items-end">
                {friendRequestData.map((user, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 cursor-pointer h-fit w-full">
                        <div className="p-4 w-full">
                            <div className="flex justify-center">
                                <img src={avatar} alt="avatar" className="w-12 h-12 rounded-full" />
                                <div className="ml-3 mr-20">
                                    <h4 className="text-sm font-medium">{user.name}</h4>
                                    <p className="text-xs text-gray-500">{user.time || 'bạn đã gửi lời mời'}</p>
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
                                    <AiOutlineMessage className="cursor-pointer text-gray-500" size={22} />
                                </Tooltip>
                            </div>

                            <div className="flex justify-between mt-6">
                                <button className="bg-gray-200 dark:bg-gray-500 hover:bg-gray-300 dark:hover:bg-gray-700 text-black dark:text-white font-semibold w-full p-2 rounded-sm mr-2">
                                    Thu hồi lời mời
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default TabFriendRequest;
