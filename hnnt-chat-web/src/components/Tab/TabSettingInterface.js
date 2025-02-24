import { useState } from 'react';
import dark from '../../public/dark.png';
import light from '../../public/light.png';

function TabSettingInterface() {
    const [selected, setSelected] = useState(true);
    const [avatarBg, setAvatarBg] = useState(true);

    return (
        <div className="max-w-md mx-auto rounded-lg text-[10px] ">
            <div className="mb-6">
                <div className="mb-3">
                    <p className="text-[14px] font-semibold mb-0.5">Cài đặt giao diện</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow flex">
                    <label className="items-center space-x-2 mr-6">
                        <img
                            src={light}
                            alt="light"
                            className={`w-[120px] rounded-lg p-1 ${selected ? 'border border-blue-500' : ''}`}
                        />
                        <div className="flex items-center p-2">
                            <input
                                type="radio"
                                name="options"
                                value={true}
                                checked={selected}
                                onChange={() => setSelected(true)}
                                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 mr-1"
                            />
                            <span className="text-gray-700">Sáng</span>
                        </div>
                    </label>
                    <label className="items-center space-x-2">
                        <img
                            src={dark}
                            alt="dark"
                            className={`w-[120px] rounded-lg p-1 ${!selected ? 'border border-blue-500' : ''}`}
                        />
                        <div className="flex items-center p-2">
                            <input
                                type="radio"
                                name="options"
                                value={false}
                                checked={!selected}
                                onChange={() => setSelected(false)}
                                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 mr-1"
                            />
                            <span className="text-gray-700">Tối</span>
                        </div>
                    </label>
                </div>
            </div>
            <div className="mb-6">
                <div className="mb-3">
                    <p className="text-[14px] font-semibold mb-0.5">Hình nền chat</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow flex justify-between">
                    <p className="text-[12px]">Đặt avatar làm hình nền</p>
                    <div className="flex">
                        <label className="flex items-center space-x-2 mr-2">
                            <input
                                type="radio"
                                name="avatarBg"
                                value={true}
                                checked={avatarBg}
                                onChange={() => setAvatarBg(true)}
                                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">Bật</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="avatarBg"
                                value={false}
                                checked={!avatarBg}
                                onChange={() => setAvatarBg(false)}
                                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">Tắt</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TabSettingInterface;
