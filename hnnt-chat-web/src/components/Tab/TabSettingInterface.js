import { useEffect, useState } from 'react';
import dark from '../../public/dark.png';
import light from '../../public/light.png';
import useDarkMode from '../../hook/useDarkMode';

function TabSettingInterface() {
    const [darkMode, setDarkMode] = useDarkMode();
    const [selected, setSelected] = useState(() => darkMode);
    const [avatarBg, setAvatarBg] = useState(true);

    const handleSelection = (value) => {
        setSelected(value);
        setDarkMode(value);

        if (value) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <div className="max-w-md mx-auto rounded-lg text-[10px] ">
            <div className="mb-6">
                <div className="mb-3">
                    <p className="text-[14px] font-semibold mb-0.5">Cài đặt giao diện</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow flex dark:bg-gray-800 dark:text-gray-300">
                    <label className="items-center space-x-2 mr-6">
                        <img
                            src={light}
                            alt="light"
                            className={`w-[120px] rounded-lg p-1 ${!selected ? 'border border-blue-500' : ''}`}
                        />
                        <div className="flex items-center p-2">
                            <input
                                type="radio"
                                name="options"
                                value="light"
                                checked={!selected}
                                onChange={() => handleSelection(false)}
                                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 mr-1"
                            />
                            <span className="text-gray-700 dark:text-gray-300">Sáng</span>
                        </div>
                    </label>
                    <label className="items-center space-x-2">
                        <img
                            src={dark}
                            alt="dark"
                            className={`w-[120px] rounded-lg p-1 ${selected ? 'border border-blue-500' : ''}`}
                        />
                        <div className="flex items-center p-2">
                            <input
                                type="radio"
                                name="options"
                                value="dark"
                                checked={selected}
                                onChange={() => handleSelection(true)}
                                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 mr-1"
                            />
                            <span className="text-gray-700 dark:text-gray-300">Tối</span>
                        </div>
                    </label>
                </div>
            </div>
            <div className="mb-6">
                <div className="mb-3">
                    <p className="text-[14px] font-semibold mb-0.5">Hình nền chat</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow flex justify-between dark:bg-gray-800 dark:text-gray-300">
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
                            <span className="text-gray-700 dark:text-gray-300">Bật</span>
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
                            <span className="text-gray-700 dark:text-gray-300">Tắt</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TabSettingInterface;
