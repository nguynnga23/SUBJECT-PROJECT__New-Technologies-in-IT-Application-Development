import PopupCategoryAndState from '../../components/Popup/PopupCategoryAndState';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveChat } from '../../redux/slices/chatSlice';

import { setActiveTabMessToOrther, setActiveTabMessToPriority } from '../../redux/slices/chatSlice';

function TabMesssage() {
    const activeTab = useSelector((state) => state.chat.activeTabMess);
    const activeChat = useSelector((state) => state.chat.activeChat);
    const data = useSelector((state) => state.chat.chats);

    const dispatch = useDispatch();

    const priorityChatsList = data.filter((chat) => chat.kind === 'priority');
    const otherChatsList = data.filter((chat) => chat.kind === 'other');
    const chats = activeTab === 'priority' ? priorityChatsList : otherChatsList;

    const getLastMessage = (messages) => {
        return messages.length > 0 ? messages.at(-1) : null;
    };

    return (
        <div>
            <div className="flex border-b justify-between p-4 pt-0 pb-0">
                <div>
                    <button
                        className={`flex-1 py-2 mr-3 pt-4 text-xs text-center font-medium ${
                            activeTab === 'priority' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                        }`}
                        onClick={() => dispatch(setActiveTabMessToPriority())}
                    >
                        Ưu tiên
                    </button>
                    <button
                        className={`flex-1 py-2 pt-4 text-xs text-center font-medium ${
                            activeTab === 'other' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                        }`}
                        onClick={() => dispatch(setActiveTabMessToOrther())}
                    >
                        Khác
                    </button>
                </div>
                <PopupCategoryAndState />
            </div>
            <div>
                {chats.map((chat) => {
                    const lastMessage = getLastMessage(chat.messages);

                    return (
                        <div
                            key={chat.id}
                            className={`p-3 overflow-y-auto cursor-pointer hover:bg-gray-200 ${
                                activeChat?.id === chat.id ? 'bg-blue-100' : ''
                            }`}
                            onClick={() => dispatch(setActiveChat(chat))}
                        >
                            <div className="flex item-center">
                                <img
                                    src={chat.avatar} // Thay bằng avatar thật
                                    className="w-[45px] h-[45px] rounded-full border mr-3 object-cover"
                                />
                                <div>
                                    <h3 className="font-medium text-xs text-lg mt-1 max-w-[270px] truncate">
                                        {chat.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 text-xs mt-1 max-w-[270px] truncate">
                                        {lastMessage?.sender === 0 ? 'You: ' : lastMessage.name}
                                        {lastMessage?.type === 'gif'
                                            ? 'GIF'
                                            : lastMessage?.type === 'image'
                                            ? 'Hình ảnh'
                                            : lastMessage?.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default TabMesssage;
