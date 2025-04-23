import TabChatRightBar from '../../components/Tab/TabChatRightBar';
import TabChatLeftBar from '../../components/Tab/TabChatLeftBar';
import TabChatRightBarSearch from '../../components/Tab/TabChatRightBarSearch';
import { useSelector } from 'react-redux';
import TabMessage from '../../components/Tab/TabMessage';
import { socket } from '../../configs/socket';
import { useEffect, useState } from 'react';
import { getChat } from './api';
import ModalShareMessage from '../../components/Modal/ModalShareMessage';
import ModalPoll from '../../components/Modal/ModalPoll';
import { ModalVotePoll } from '../../components/Modal/ModalVotePoll';

function Messaging() {
    const userActive = useSelector((state) => state.auth.userActive);
    const activeChat = useSelector((state) => state.chat.activeChat);
    const showRightBar = useSelector((state) => state.chat.showRightBar);
    const showRightBarSearch = useSelector((state) => state.chat.showRightBarSearch);
    const [notification, setNotification] = useState(null);
    const [chats, setChats] = useState([]);
    const [showModalShareMes, setShowModalShareMes] = useState(false);
    const [message, setMessage] = useState();

    // open modal poll
    const isModalCreatePoll = useSelector((state) => state.modal.showModalCreatePoll);
    const showModalVotePoll = useSelector((state) => state.modal.showModalVotePoll);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const chats = await getChat();
                setChats(chats);
            } catch (err) {
                console.log(err.message);
            }
        };

        fetchMessages();
    }, [chats]);

    useEffect(() => {
        const handleReceiveMessage = ({ chatId: receivedChatId, newMessage }) => {
            const isCurrentChat = chats.find((chat) => chat?.id === receivedChatId);

            if (isCurrentChat && !(receivedChatId === activeChat?.id)) {
                const me = isCurrentChat?.participants?.find((user) => user?.accountId === userActive?.id);
                // 👇 Nếu tin nhắn đến từ chat khác, thì hiện thông báo
                if (!me?.notify) return;
                setNotification({
                    content: newMessage.content,
                    sender: newMessage.sender?.name || 'Người gửi',
                    timestamp: newMessage.time,
                });

                // 👇 Ẩn thông báo sau 5 giây
                setTimeout(() => {
                    setNotification(null);
                }, 5000);
            }
        };

        socket.on('receive_message', handleReceiveMessage);
        return () => socket.off('receive_message', handleReceiveMessage);
    }, [activeChat?.id, chats]);

    return (
        <div className="h-screen flex flex-col">
            <div className="flex-1 flex min-h-0 ">
                <TabChatLeftBar />
                <div
                    className={`relative flex flex-col bg-white dark:bg-[#16191d] ${
                        showRightBar || showRightBarSearch ? 'w-2/4' : 'w-3/4'
                    }`}
                >
                    {activeChat ? (
                        <>
                            {showModalShareMes && (
                                <ModalShareMessage setShowModalShareMes={setShowModalShareMes} message={message} />
                            )}
                            {isModalCreatePoll && <ModalPoll />}
                            {showModalVotePoll && <ModalVotePoll />}
                            <TabMessage setShowModalShareMes={setShowModalShareMes} setMessageShare={setMessage} />
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-white">
                            Chọn một cuộc trò chuyện để bắt đầu
                        </div>
                    )}
                </div>
                {showRightBar && <TabChatRightBar />}
                {showRightBarSearch && <TabChatRightBarSearch />}
                {notification && (
                    <div className="fixed bottom-6 right-6 bg-white shadow-lg rounded-lg p-4 border border-blue-500 w-80 z-50 animate-slide-in">
                        <div className="font-semibold">{notification.sender}</div>
                        <div className="text-gray-700 mt-1">{notification.content}</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Messaging;
