import { useState } from 'react';
import { PiChatCircleTextFill } from 'react-icons/pi';
import { RiContactsBook3Line } from 'react-icons/ri';
import { IoSettingsOutline } from 'react-icons/io5';
import { IoMdCloudOutline } from 'react-icons/io';

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
                <img src={avatar} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-white object-cover" />

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
