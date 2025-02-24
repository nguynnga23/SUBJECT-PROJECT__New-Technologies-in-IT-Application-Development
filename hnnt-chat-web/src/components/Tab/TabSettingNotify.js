import { useState } from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';
import { IoNotificationsOffOutline } from 'react-icons/io5';

function TabSettingNotify() {
    const [selected, setSelected] = useState(true);
    const [sound, setSound] = useState(true);

    return (
        <div className="max-w-md mx-auto rounded-lg text-[10px] ">
            <div className="mb-6">
                <div className="mb-3">
                    <p className="text-[14px] font-semibold mb-0.5">Thông báo</p>
                    <p className="text-gray-400 text-[11px] ">Nhận được thông báo khi có tin nhắn mới</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow flex">
                    <label className="flex items-center space-x-2 mr-6">
                        <IoNotificationsOutline
                            size={40}
                            className={`${selected ? 'text-blue-500' : 'text-gray-400'}`}
                        />

                        <input
                            type="radio"
                            name="options"
                            value={true}
                            checked={selected}
                            onChange={() => setSelected(true)}
                            className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Bật</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <IoNotificationsOffOutline
                            size={40}
                            className={`${!selected ? 'text-blue-500' : 'text-gray-400'}`}
                        />

                        <input
                            type="radio"
                            name="options"
                            value={false}
                            checked={!selected}
                            onChange={() => setSelected(false)}
                            className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Tắt</span>
                    </label>
                </div>
            </div>

            <div className="mb-6">
                <div className="mb-3">
                    <p className="text-[14px] font-semibold mb-0.5">Âm thanh khi nhận được thông báo</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow flex justify-between">
                    <p className="text-[12px]">Phát âm thanh thông báo khi có tin nhắn</p>
                    <div className="flex">
                        <label className="flex items-center space-x-2 mr-2">
                            <input
                                type="radio"
                                name="sound"
                                value={true}
                                checked={sound}
                                onChange={() => setSound(true)}
                                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">Bật</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="sound"
                                value={false}
                                checked={!sound}
                                onChange={() => setSound(false)}
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

export default TabSettingNotify;
