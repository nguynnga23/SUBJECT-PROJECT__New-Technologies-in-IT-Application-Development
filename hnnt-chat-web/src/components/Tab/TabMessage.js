import PopupCategoryAndState from '../../components/Popup/PopupCategoryAndState';

const priorityChats = [
    { id: 1, name: 'Nguyen Van A', message: 'Xin chào!', time: '10:00 AM' },
    { id: 2, name: 'Tran Thi B', message: 'Hôm nay bạn thế nào?', time: '11:15 AM' },
];

const otherChats = [{ id: 3, name: 'Le Van C', message: 'Hẹn gặp bạn sau!', time: '1:30 PM' }];

function TabMesssage({ activeTab, setActiveTab, selectedChat, setSelectedChat }) {
    const chats = activeTab === 'priority' ? priorityChats : otherChats;

    return (
        <div>
            <div className="flex border-b justify-between">
                <div>
                    <button
                        className={`flex-1 py-2 mr-3 pt-4 text-xs text-center font-medium ${
                            activeTab === 'priority' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                        }`}
                        onClick={() => setActiveTab('priority')}
                    >
                        Ưu tiên
                    </button>
                    <button
                        className={`flex-1 py-2 pt-4 text-xs text-center font-medium ${
                            activeTab === 'other' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                        }`}
                        onClick={() => setActiveTab('other')}
                    >
                        Khác
                    </button>
                </div>
                <PopupCategoryAndState />
            </div>
            <div>
                {chats.map((chat) => (
                    <div
                        key={chat.id}
                        className={`p-3 border-b cursor-pointer ${selectedChat?.id === chat.id ? 'bg-blue-100' : ''}`}
                        onClick={() => setSelectedChat(chat)}
                    >
                        <h3 className="font-bold">{chat.name}</h3>
                        <p className="text-sm text-gray-600">{chat.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TabMesssage;
