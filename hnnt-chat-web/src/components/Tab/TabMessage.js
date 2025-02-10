import PopupCategoryAndState from '../../components/Popup/PopupCategoryAndState';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveChat } from '../../redux/slices/chatSlice';

import { setActiveTabMessToOrther, setActiveTabMessToPriority } from '../../redux/slices/chatSlice';

const priorityChats = [
    {
        id: 1,
        name: 'Nguyen Van A',
        avatar: 'https://www.catster.com/wp-content/uploads/2023/11/Beluga-Cat-e1714190563227.webp',
        message: 'Xin chào!',
        time: '10:00 AM',
        pin: true,
        note: true,
        messages: [
            {
                sender: 1,
                content: 'Chào bạn',
                time: '10:00 AM',
            },
            {
                sender: 0,
                content: 'Chào nha',
                time: '11: 00AM',
            },
        ],
    },
    {
        id: 2,
        name: 'Tran Thi B',
        avatar: 'https://m.media-amazon.com/images/I/518K-+yYl2L._AC_SL1000_.jpg',
        message: 'Hôm nay bạn thế nào?',
        time: '11:15 AM',
        pin: true,
        note: true,
        messages: [
            {
                sender: 2,
                content: 'Chào bạn',
                time: '10:00 AM',
            },
            {
                sender: 0,
                content: 'Chào nha',
                time: '11: 00AM',
            },
        ],
    },
];

const otherChats = [
    {
        id: 3,
        name: 'Le Van C',
        avatar: 'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474174ewO/anh-meme-meo-khoc-cuc-cute_042216244.jpg',
        message: 'Hẹn gặp bạn sau!',
        time: '1:30 PM',
        pin: true,
        note: true,
        messages: [
            {
                sender: 3,
                content: 'Chào bạn',
                time: '10:00 AM',
            },
            {
                sender: 0,
                content: 'Chào nha',
                time: '11: 00AM',
            },
        ],
    },
];

function TabMesssage() {
    const activeTab = useSelector((state) => state.chat.activeTabMess);
    const chats = activeTab === 'priority' ? priorityChats : otherChats;
    const activeChat = useSelector((state) => state.chat.activeChat);

    const dispatch = useDispatch();

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
                {chats.map((chat) => (
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
                                <h3 className="font-medium text-xs text-lg mt-1">{chat.name}</h3>
                                <p className="text-sm text-gray-600 text-xs mt-1">{chat.message}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TabMesssage;
