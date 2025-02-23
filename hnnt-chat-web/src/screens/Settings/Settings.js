import { useState } from 'react';
import { CiCircleRemove } from 'react-icons/ci';
import TabSettingAuthen from '../../components/Tab/TabSettingAuthen';
import { CiLock } from 'react-icons/ci';
import { MdSecurity } from 'react-icons/md';
import { HiOutlineBellAlert } from 'react-icons/hi2';
import { PiBroomLight } from 'react-icons/pi';

function Settings({ setSettingScreen }) {
    const [tab, setTab] = useState('authen');

    return (
        <div className="w-full flex">
            <div className="fixed inset-0 flex items-center justify-center bg-opacity-80 z-50 bg-gray-400 ">
                <div className="flex relative h-[450px] w-[800px] border rounded-lg bg-white shadow-md text-[13px]">
                    <CiCircleRemove
                        className="absolute top-[-30px] right-[-30px] text-3xl text-white cursor-pointer"
                        onClick={() => setSettingScreen(false)}
                    />
                    {/* Sidebar */}
                    <div className="w-1/3 p-4 border-r">
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

                    <div className="p-6 w-2/3 bg-gray-200 rounded-r-lg">{tab === 'authen' && <TabSettingAuthen />}</div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
