import { useState } from 'react';
import TabChat from '../../components/Tab/TabChat';
import TabChatRightBar from '../../components/Tab/TabChatRightBar';
import TabChatLeftBar from '../../components/Tab/TabChatLeftBar';
import TabChatRightBarSearch from '../../components/Tab/TabChatRightBarSearch';
import { useSelector } from 'react-redux';

function Messaging() {
    const [showRightBar, setShowRightBar] = useState(false);
    const [showRightBarSearch, setShowRightBarSearch] = useState(false);
    const [notify, setNotify] = useState(true);
    const [pin, setPin] = useState(false);

    const activeChat = useSelector((state) => state.chat.activeChat);

    return (
        <div className="h-screen flex flex-col">
            <div className="flex-1 flex min-h-0 ">
                <TabChatLeftBar />
                <div className={`flex flex-col bg-white ${showRightBar || showRightBarSearch ? 'w-2/4' : 'w-3/4'}`}>
                    {activeChat ? (
                        <TabChat
                            showRightBar={showRightBar}
                            setShowRightBar={setShowRightBar}
                            showRightBarSearch={showRightBarSearch}
                            setShowRightBarSearch={setShowRightBarSearch}
                        />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            Chọn một cuộc trò chuyện để bắt đầu
                        </div>
                    )}
                </div>
                {showRightBar && <TabChatRightBar />}
                {showRightBarSearch && <TabChatRightBarSearch />}
            </div>
        </div>
    );
}

export default Messaging;
