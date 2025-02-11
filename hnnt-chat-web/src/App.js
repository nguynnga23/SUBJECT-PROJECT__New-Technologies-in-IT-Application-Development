import { useState } from 'react';
import { PiChatCircleTextFill } from 'react-icons/pi';
import { RiContactsBook3Line } from 'react-icons/ri';
import { IoSettingsOutline } from 'react-icons/io5';
import { IoMdCloudOutline } from 'react-icons/io';
import { CiShare1 } from 'react-icons/ci';

import Messaging from './screens/Messaging';
import Contacts from './screens/Contacts';
import Settings from './screens/Settings';

import avatar from './public/avatar_sample.jpg';

export default function ZaloUI() {
    const [selectedScreen, setSelectedScreen] = useState('messaging');
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-16 h-screen bg-blue-600 flex flex-col items-center py-4 space-y-6">
                {/* Avatar */}
                <div>
                    <button
                        id="dropdownUserAvatarButton"
                        data-dropdown-toggle="dropdownAvatar"
                        data-dropdown-placement="right-end"
                        className="flex text-sm"
                        type="button"
                    >
                        <img src={avatar} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-white" />
                    </button>
                    {/* Dropdown menu */}
                    <div
                        id="dropdownAvatar"
                        className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg ring-2 ring-gray-200"
                    >
                        <div className="px-4 py-3 text-sm text-black ">
                            <p className="text-lg font-medium ">Nguyễn Thiên Tứ</p>
                        </div>
                        <ul
                            className="py-2 text-sm text-gray-700 dark:text-gray-200"
                            aria-labelledby="dropdownUserAvatarButton"
                        >
                            <li>
                                <p className="block px-4 py-2 hover:bg-gray-100 text-black flex items-center gap-x-6">
                                    Nâng cấp tài khoản
                                    <CiShare1 />
                                </p>
                            </li>
                            <li>
                                <p className="block px-4 py-2 hover:bg-gray-100 text-black">Hồ sơ của bạn</p>
                            </li>
                            <li>
                                <p className="block px-4 py-2 hover:bg-gray-100 text-black">Cài đặt</p>
                            </li>
                        </ul>
                        <div className="">
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 text-black">
                                Đăng xuất
                            </a>
                        </div>
                    </div>
                </div>

                {/* Menu Icons */}
                <div className="flex flex-col space-y-6 text-white ">
                    {/* open Messaging */}
                    <div
                        className={`w-10 h-10 rounded-[5px] flex items-center justify-center cursor-pointer ${
                            selectedScreen === 'messaging' ? 'bg-white bg-opacity-20' : ''
                        }`}
                    >
                        <PiChatCircleTextFill size={28} onClick={() => setSelectedScreen('messaging')} />
                    </div>
                    {/* open Contacts */}
                    <div
                        className={`w-10 h-10 rounded-[5px] flex items-center justify-center cursor-pointer ${
                            selectedScreen === 'contacts' ? 'bg-white bg-opacity-20' : ''
                        }`}
                    >
                        <RiContactsBook3Line size={28} onClick={() => setSelectedScreen('contacts')} />
                    </div>
                </div>

                {/* Divider */}
                <div className="flex-1 "></div>
                <div className="w-10 border-t border-white"></div>

                {/* More Icons */}
                <div className="flex flex-col space-y-6 text-white">
                    <div className="w-10 h-10 rounded-[5px] flex items-center justify-center">
                        <IoMdCloudOutline size={28} />
                    </div>
                    {/* open Settings */}
                    <div
                        className={`w-10 h-10 rounded-[5px] flex items-center justify-center cursor-pointer ${
                            selectedScreen === 'settings' ? 'bg-white bg-opacity-20' : ''
                        }`}
                    >
                        <IoSettingsOutline size={28} onClick={() => setSelectedScreen('settings')} />
                    </div>
                </div>
            </div>
            {/* Screen open */}
            <div className="flex-1 bg-white">
                {selectedScreen === 'messaging' && <Messaging />}
                {selectedScreen === 'contacts' && <Contacts />}
                {selectedScreen === 'settings' && <Settings />}
            </div>
        </div>
    );
}
