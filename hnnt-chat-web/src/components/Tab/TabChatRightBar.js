import { useEffect, useState } from 'react';
import TabChatInfo from './TabChatInfo';
import TabChatSympol from './TabChatSympol';
import { useSelector } from 'react-redux';
import TabChatInfoGroup from './TabChatInfoGroup';

function TabChatRightBar() {
    const initTab = useSelector((state) => state.chat.rightBarTab);
    const activeChat = useSelector((state) => state.chat.data.find((chat) => chat.id === state.chat.activeChat?.id));

    const [activeMessageTab, setActiveMessageTab] = useState(initTab);

    useEffect(() => {
        if (!activeChat?.group) {
            setActiveMessageTab('info');
        }
    }, [activeChat]);

    return (
        <div className="w-1/4 flex flex-col bg-white min-w-[350px] border-l">
            {/* Tabs */}
            <div className="flex">
                <button
                    className={`flex-1 p-[18.5px] text-center font-medium w-[50%] ${
                        activeMessageTab === 'info' || activeMessageTab === 'infoGroup' ? 'bg-white' : 'bg-gray-200'
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
            {activeMessageTab === 'info' && <TabChatInfo setActiveMessageTab={setActiveMessageTab} />}

            {activeMessageTab === 'sympol' && <TabChatSympol />}

            {activeMessageTab === 'infoGroup' && activeChat.group && (
                <TabChatInfoGroup setActiveMessageTab={setActiveMessageTab} group={activeChat} />
            )}
        </div>
    );
}

export default TabChatRightBar;
