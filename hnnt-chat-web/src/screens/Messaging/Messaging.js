import { useState } from 'react';
import TabChat from '../../components/Tab/TabChat';
import TabChatRightBar from '../../components/Tab/TabChatRightBar';
import TabChatLeftBar from '../../components/Tab/TabChatLeftBar';

function Messaging() {
    const [selectedChat, setSelectedChat] = useState(null);
    const [showRightBar, setShowRightBar] = useState(false);

    return (
        <div className="h-screen flex flex-col">
            <div className="flex-1 flex min-h-0 ">
                <TabChatLeftBar selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
                <div className={`flex flex-col bg-white ${showRightBar ? 'w-2/4' : 'w-3/4'}`}>
                    {selectedChat ? (
                        <TabChat
                            selectedChat={selectedChat}
                            showRightBar={showRightBar}
                            setShowRightBar={setShowRightBar}
                        />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            Chọn một cuộc trò chuyện để bắt đầu
                        </div>
                    )}
                </div>
                {showRightBar && <TabChatRightBar selectedChat={selectedChat} />}
            </div>
        </div>
    );
}

export default Messaging;
