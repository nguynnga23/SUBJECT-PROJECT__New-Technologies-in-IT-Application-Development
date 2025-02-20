import { useState } from 'react';
import TabChatInfo from './TabChatInfo';
import TabChatSympol from './TabChatSympol';
import { useDispatch, useSelector } from 'react-redux';

function TabChatRightBar() {
    const initTab = useSelector((state) => state.chat.rightBarTab);

    const [activeMessageTab, setActiveMessageTab] = useState(initTab);

    return (
        <div className="w-1/4 flex flex-col bg-white min-w-[350px] border-l">
            {/* Tabs */}
            <div className="flex">
                <button
                    className={`flex-1 p-[18.5px] text-center font-medium w-[50%] ${
                        activeMessageTab === 'info' ? 'bg-white' : 'bg-gray-200'
                    }`}
                    onClick={() => setActiveMessageTab('info')}
                >
                    Thông tin
                </button>
                <button
                    className={`flex-1 py-2 text-center font-medium w-[50%] ${
                        activeMessageTab === 'sympol' ? 'bg-white' : 'bg-gray-200'
                    }`}
                    onClick={() => setActiveMessageTab('sympol')}
                >
                    Biểu tượng
                </button>
            </div>

            {/* Nội dung */}
            {activeMessageTab === 'info' && <TabChatInfo />}

            {activeMessageTab === 'sympol' && <TabChatSympol />}
        </div>
    );
}

export default TabChatRightBar;
