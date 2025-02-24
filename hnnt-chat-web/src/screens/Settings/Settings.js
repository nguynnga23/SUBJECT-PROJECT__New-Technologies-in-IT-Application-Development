import { useState } from 'react';
import { CiCircleRemove } from 'react-icons/ci';
import TabSettingAuthen from '../../components/Tab/TabSettingAuthen';
import TabSettingInterface from '../../components/Tab/TabSettingInterface';
import TabSettingNotify from '../../components/Tab/TabSettingNotify';
import TabSettingPrivate from '../../components/Tab/TabSettingPrivate';
import { CiLock } from 'react-icons/ci';
import { MdSecurity } from 'react-icons/md';
import { HiOutlineBellAlert } from 'react-icons/hi2';
import { PiBroomLight } from 'react-icons/pi';

function Settings({ setSettingScreen }) {
    const [tab, setTab] = useState('authen');

    return (
        <div className="w-full flex">
            <div className="fixed inset-0 flex items-center justify-center bg-opacity-80 z-50 bg-gray-400 ">
                <div className="flex relative h-[450px] w-[800px] border rounded-lg shadow-md text-[13px]  bg-gray-200">
                    <CiCircleRemove
                        className="absolute top-[-30px] right-[-30px] text-3xl text-white cursor-pointer"
                        onClick={() => setSettingScreen(false)}
                    />
                    {/* Sidebar */}
                    <div className="w-1/3 p-4 border-r bg-white rounded-l-lg">
                        <h2 className="text-[20px] font-semibold mb-4">Cài đặt</h2>
                        <ul className="space-y-2">
                            <li
                                className={`flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer ${
                                    tab === 'authen' ? 'bg-gray-200' : ''
                                }`}
                                onClick={() => setTab('authen')}
                            >
                                <MdSecurity className="mr-2 text-gray-500" size={20} />
                                Tài khoản và bảo mật
                            </li>
                            <li
                                className={`flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer ${
                                    tab === 'private' ? 'bg-gray-200' : ''
                                }`}
                                onClick={() => setTab('private')}
                            >
                                <CiLock className="mr-2 text-gray-600" size={20} />
                                Quyền riêng tư
                            </li>
                            <li
                                className={`flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer ${
                                    tab === 'notify' ? 'bg-gray-200' : ''
                                }`}
                                onClick={() => setTab('notify')}
                            >
                                <HiOutlineBellAlert className="mr-2 text-gray-500" size={20} />
                                Thông báo
                            </li>
                            <li
                                className={`flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer ${
                                    tab === 'interface' ? 'bg-gray-200' : ''
                                }`}
                                onClick={() => setTab('interface')}
                            >
                                <PiBroomLight className="mr-2 text-gray-600" size={20} />
                                Giao diện
                            </li>
                        </ul>
                    </div>

                    {/* Content */}

                    <div className="m-6 w-2/3 rounded-r-lg overflow-auto">
                        {tab === 'authen' && <TabSettingAuthen />}
                        {tab === 'private' && <TabSettingPrivate />}
                        {tab === 'notify' && <TabSettingNotify />}
                        {tab === 'interface' && <TabSettingInterface />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
