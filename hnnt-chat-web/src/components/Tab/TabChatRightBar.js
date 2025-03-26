import { useEffect, useState } from 'react';
import TabChatInfo from './TabChatInfo';
import TabChatSympol from './TabChatSympol';
import { useSelector } from 'react-redux';
import TabChatInfoGroup from './TabChatInfoGroup';

function TabChatRightBar() {
    const initTab = useSelector((state) => state.chat.rightBarTab);
    const activeChat = useSelector((state) => state.chat.activeChat);

    const [activeMessageTab, setActiveMessageTab] = useState(initTab);

    useEffect(() => {
        if (!activeChat?.isGroup) {
            setActiveMessageTab('info');
        }
    }, [activeChat.isGroup]);

    return (
        <div className="w-1/4 flex flex-col bg-white dark:bg-gray-800  min-w-[350px] border-l dark:border-l-black">
            {/* Tabs */}
            <div className="flex">
                <button
                    className={`flex-1 p-[18.5px] text-center font-medium w-[50%] dark:text-gray-300 ${
                        activeMessageTab === 'info' || activeMessageTab === 'infoGroup'
                            ? 'bg-white dark:bg-gray-800'
                            : 'bg-gray-200 dark:bg-gray-900'
                    }`}
                    onClick={() => setActiveMessageTab('info')}
                >
                    Thông tin
                </button>
                <button
                    className={`flex-1 py-2 text-center font-medium w-[50%] dark:text-gray-300 ${
                        activeMessageTab === 'sympol' ? 'bg-white dark:bg-gray-800' : 'bg-gray-200 dark:bg-gray-900'
                    }`}
                    onClick={() => setActiveMessageTab('sympol')}
                >
                    Biểu tượng
                </button>
            </div>

            {/* Nội dung */}
            {activeMessageTab === 'info' && <TabChatInfo setActiveMessageTab={setActiveMessageTab} />}

            {activeMessageTab === 'sympol' && <TabChatSympol />}

            {activeMessageTab === 'infoGroup' && activeChat?.isGroup && (
                <TabChatInfoGroup setActiveMessageTab={setActiveMessageTab} group={activeChat} />
            )}
        </div>
    );
}

export default TabChatRightBar;
