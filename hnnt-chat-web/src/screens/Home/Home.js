import { useEffect, useState, useRef } from 'react';
import { PiChatCircleTextFill } from 'react-icons/pi';
import { RiContactsBook3Line } from 'react-icons/ri';
import { IoSettingsOutline } from 'react-icons/io5';
import { IoMdCloudOutline } from 'react-icons/io';
import { CiShare1 } from 'react-icons/ci';

// import { setChats } from '../../redux/slices/chatSlice';
import Messaging from '../Messaging';
import Contacts from '../Contacts';
import Settings from '../Settings';

import { useSelector } from 'react-redux';
// import groups from '../../sample_data/listGroup';
import { useNavigate } from 'react-router-dom';

import Modal from '../../components/Modal';

export default function Home() {
    const navigate = useNavigate();
    const [selectedScreen, setSelectedScreen] = useState('messaging');
    const [settingScreen, setSettingScreen] = useState(false);
    // const dispatch = useDispatch();
    const userActive = useSelector((state) => state.auth.userActive);
    useEffect(() => {
        if (!userActive) {
            navigate('/');
        }
    }, [userActive, navigate]);

    // open modal
    const [isOpenModel, setIsOpenModel] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-[#16191d]">
            {/* Sidebar */}
            <div className="w-16 h-screen bg-blue-600 dark:bg-gray-900 flex flex-col items-center py-4 space-y-6">
                {/* Avatar */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        id="dropdownUserAvatarButton"
                        data-dropdown-toggle="dropdownAvatar"
                        data-dropdown-placement="right-end"
                        className="flex text-sm cursor-pointer"
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <img
                            src={userActive?.avatar}
                            alt="Avatar"
                            className="w-12 h-12 rounded-full border-2 border-white object-cover"
                        />
                    </button>
                    {/* Dropdown menu */}
                    <div
                        id="dropdownAvatar"
                        className={`z-10 bg-white divide-y divide-gray-100 rounded-lg ring-2 ring-gray-200 absolute top-0 left-14 min-w-64 z-20 ${
                            isDropdownOpen ? 'block' : 'hidden'
                        }`}
                    >
                        <div className="px-4 py-3 text-sm text-black ">
                            <p className="text-lg font-medium ">{userActive?.name}</p>
                        </div>
                        <ul
                            className="py-2 text-sm text-gray-700 dark:text-gray-200"
                            aria-labelledby="dropdownUserAvatarButton"
                        >
                            <li>
                                <p className="block px-4 py-2 hover:bg-gray-100 text-black flex items-center gap-x-6 cursor-pointer">
                                    Nâng cấp tài khoản
                                    <CiShare1 />
                                </p>
                            </li>
                            <li>
                                <p
                                    className="block px-4 py-2 hover:bg-gray-100  text-black cursor-pointer"
                                    onClick={() => setIsOpenModel(true)}
                                >
                                    Hồ sơ của bạn
                                </p>
                            </li>
                            <li>
                                <p className="block px-4 py-2 hover:bg-gray-100 text-black cursor-pointer">Cài đặt</p>
                            </li>
                        </ul>
                        <div className="">
                            <p className="block px-4 py-2 hover:bg-gray-100 text-black cursor-pointer">Đăng xuất</p>
                        </div>
                    </div>
                </div>

                {/* Menu Icons */}
                <div className="flex flex-col space-y-6 text-white ">
                    {/* open Messaging */}
                    <div
                        className={`w-10 h-10 rounded-[5px] flex items-center justify-center cursor-pointer hover:bg-white hover:bg-opacity-20 ${
                            selectedScreen === 'messaging' ? 'bg-white bg-opacity-20' : ''
                        }`}
                    >
                        <PiChatCircleTextFill size={28} onClick={() => setSelectedScreen('messaging')} />
                    </div>
                    {/* open Contacts */}
                    <div
                        className={`w-10 h-10 rounded-[5px] flex items-center justify-center cursor-pointer hover:bg-white hover:bg-opacity-20 ${
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
                <div className="flex flex-col space-y-6 text-white ">
                    <div className="w-10 h-10 rounded-[5px] flex items-center justify-center hover:bg-white hover:bg-opacity-20">
                        <IoMdCloudOutline size={28} />
                    </div>
                    {/* open Settings */}
                    <div
                        className={`w-10 h-10 rounded-[5px] flex items-center justify-center cursor-pointer hover:bg-white hover:bg-opacity-20 ${
                            selectedScreen === 'settings' ? 'bg-white bg-opacity-20' : ''
                        }`}
                    >
                        <IoSettingsOutline size={28} onClick={() => setSettingScreen(true)} />
                    </div>
                </div>
            </div>
            {/* Screen open */}
            <div className="relative flex-1 bg-white ">
                {selectedScreen === 'messaging' && <Messaging />}
                {selectedScreen === 'contacts' && <Contacts />}
                {settingScreen && <Settings setSettingScreen={setSettingScreen} />}
            </div>

            <Modal isOpen={isOpenModel} onClose={() => setIsOpenModel(false)} />
        </div>
    );
}
