import React from 'react';
import { AiOutlineMessage } from 'react-icons/ai';
import { Tooltip } from '@mui/material';
import avatar from '../../public/avatar_sample.jpg';
import empty from '../../public/empty_friend.png';
import { acceptFriendReponse, refuseFriendReponse } from '../../screens/Contacts/api';

function TabFriendRequest(props) {
    const { friendResponsetData, friendRequestData } = props;

    const handleConvertTime = (isoDate) => {
        const date = new Date(isoDate);

        const month = date.getMonth() + 1; // getMonth() trả về 0-11
        const day = date.getDate();
        const result = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}`;
        return result;
    };

    const handleAceptReponseFriend = async (requestId) => {
        try {
            await acceptFriendReponse(requestId);
        } catch (error) {
            console.error('Lỗi khi kết bạn', error);
        }
    };
    const handleRefuseResponseFriend = async (requestId) => {
        try {
            await refuseFriendReponse(requestId);
        } catch (error) {
            console.error('Lỗi khi từ chối kết bạn', error);
        }
    };

    return (
        <>
            <div className={friendResponsetData.length === 0 ? '' : 'grid grid-cols-3 gap-4 justify-items-end'}>
                {friendResponsetData.map((user, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg w-full cursor-pointer h-fit">
                        <div className="p-4 w-full">
                            <div className="flex justify-center">
                                <img src={user?.avatar} alt="avatar" className="w-12 h-12 rounded-full" />
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
                                <p className="text-sm">Xin chào, mình là {user.name}. Kết bạn với mình nhé!</p>
                            </div>
                            <div className="flex justify-between mt-6">
                                <button
                                    className="bg-gray-200 dark:bg-gray-500 hover:bg-gray-300 dark:hover:bg-gray-700 text-black dark:text-white font-semibold w-full p-2 rounded-sm mr-2"
                                    onClick={() => handleRefuseResponseFriend(user.requestId)}
                                >
                                    Từ chối
                                </button>
                                <button
                                    className="bg-blue-200 hover:bg-blue-300 text-blue-800 font-semibold w-full p-2 rounded-sm ml-2"
                                    onClick={() => handleAceptReponseFriend(user.requestId)}
                                >
                                    Đồng ý
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {friendResponsetData.length === 0 && (
                    <div className="flex flex-col justify-center items-center">
                        <img src={empty} alt="No friends found" className="w-40 h-40 mb-4" />
                        <p className="text-gray-500 text-lg">Không có bạn bè nào</p>
                    </div>
                )}
            </div>

            {/* lời mời đã gửi */}
            <p className="text-base font-semibold pl-3 text-gray-600 dark:text-gray-100 my-5">Lời mời đã gửi</p>

            <div className={friendRequestData.length === 0 ? '' : 'grid grid-cols-3 gap-4 justify-items-end'}>
                {friendRequestData.map((user, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 cursor-pointer h-fit w-full">
                        <div className="p-4 w-full">
                            <div className="flex justify-center">
                                <img src={user?.avatar} alt="avatar" className="w-12 h-12 rounded-full" />
                                <div className="ml-3 mr-20">
                                    <h4 className="text-sm font-medium">{user?.name}</h4>
                                    <p className="text-xs text-gray-500">
                                        {handleConvertTime(user?.createdAt) || 'bạn đã gửi lời mời'}
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

                            <div className="flex justify-between mt-6">
                                <button
                                    onClick={() => handleRefuseResponseFriend(user.requestId)}
                                    className="bg-gray-200 dark:bg-gray-500 hover:bg-gray-300 dark:hover:bg-gray-700 text-black dark:text-white font-semibold w-full p-2 rounded-sm mr-2"
                                >
                                    Thu hồi lời mời
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {friendRequestData.length === 0 && (
                    <div className="flex flex-col justify-center items-center">
                        <img src={empty} alt="No friends found" className="w-40 h-40 mb-4" />
                        <p className="text-gray-500 text-lg">Không có bạn bè nào</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default TabFriendRequest;
