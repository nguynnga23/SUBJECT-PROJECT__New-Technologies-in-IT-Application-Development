import { useState } from 'react';
import TabChatInfo from './TabChatInfo';
import TabChatSympol from './TabChatSympol';

function TabChatRightBar({ selectedChat }) {
    const [activeMessageTab, setActiveMessageTab] = useState('info');

    return (
        <div className="w-1/4 flex flex-col bg-white min-w-[320px] border-l">
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
                        activeMessageTab === 'emoji' ? 'bg-white' : 'bg-gray-200'
                    }`}
                    onClick={() => setActiveMessageTab('emoji')}
                >
                    Biểu tượng
                </button>
            </div>

            {/* Nội dung */}
            {activeMessageTab === 'info' && <TabChatInfo selectedChat={selectedChat} />}

            {activeMessageTab === 'emoji' && <TabChatSympol />}
        </div>
    );
}

export default TabChatRightBar;
