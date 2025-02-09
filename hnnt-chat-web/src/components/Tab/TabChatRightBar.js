import { useState } from 'react';
import TabChatInfo from './TabChatInfo';

function TabChatRightBar({ selectedChat }) {
    const [activeMessageTab, setActiveMessageTab] = useState('info');

    return (
        <div className="w-1/4 flex flex-col bg-white min-w-[330px] border-l">
            {/* Tabs */}
            <div className="flex border-b">
                <button
                    className={`flex-1 py-3.5 text-center font-medium ${
                        activeMessageTab === 'info' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                    }`}
                    onClick={() => setActiveMessageTab('info')}
                >
                    Thông tin
                </button>
                <button
                    className={`flex-1 py-2 text-center font-medium ${
                        activeMessageTab === 'emoji' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                    }`}
                    onClick={() => setActiveMessageTab('emoji')}
                >
                    Biểu tượng
                </button>
            </div>

            {/* Nội dung */}
            {activeMessageTab === 'info' && <TabChatInfo selectedChat={selectedChat} />}

            {activeMessageTab === 'emoji' && <div className="p-4 text-gray-500 text-center">Tab Biểu tượng</div>}
        </div>
    );
}

export default TabChatRightBar;
