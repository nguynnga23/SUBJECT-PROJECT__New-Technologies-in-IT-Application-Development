import { useEffect, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { searchFollowKeyWordByChat } from '../../screens/Messaging/api';
import { useSelector } from 'react-redux';
import TabSearchAll from './TabSearchAll';
import { TiDelete } from 'react-icons/ti';

function TabChatRightBarSearch() {
    const activeChat = useSelector((state) => state.chat.activeChat);
    const chatId = activeChat.id;
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);
    const scrollToMessage = (messageId) => {
        setTimeout(() => {
            const messageElement = document.getElementById(`message-${messageId}`);
            if (messageElement) {
                messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Thêm hiệu ứng phát sáng
                messageElement.classList.add('highlight');

                // Xóa hiệu ứng sau 1.5 giây
                messageElement.classList.add('bg-blue-200');
                messageElement.classList.add('rounded-[5px]');

                // Xóa class sau 1.5 giây
                setTimeout(() => {
                    messageElement.classList.remove('bg-blue-200');
                    messageElement.classList.remove('rounded-[5px]');
                }, 1500);
            } else {
                console.log('Không tìm thấy phần tử:', `message-${messageId}`);
            }
        }, 100); // Đợi 100ms để đảm bảo phần tử đã được render
    };

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (searchTerm.trim()) {
                try {
                    const response = await searchFollowKeyWordByChat(searchTerm, chatId);
                    setData(response.messages);
                } catch (error) {
                    console.error('Lỗi khi tìm kiếm:', error);
                }
            } else {
                setData([]);
            }
        }, 1000);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, setData]);

    return (
        <div className="w-1/4 h-screen bg-white border-l min-w-[350px] dark:bg-gray-800 dark:text-gray-300 dark:border-l-black">
            {/* Header */}
            <div className="relative flex justify-center items-center h-[62px] border-b dark:border-b-black">
                <h2 className="text-lg font-semibold p-1">Tìm kiếm trong trò chuyện</h2>
            </div>

            {/* Search Input */}
            <div className="relative p-4">
                <IoSearchOutline className="absolute top-7 left-6 text-gray-400 " size={18} />
                <input
                    type="text"
                    className="w-full pl-8 pr-8 py-2 border rounded-md focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-black"
                    placeholder="Nhập từ khóa tìm kiếm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm !== '' && (
                    <TiDelete
                        className="absolute right-[25px] top-[30px] text-gray-500 text-xs cursor-pointer bg-white dark:bg-gray-900"
                        size={16}
                        onClick={() => {
                            setSearchTerm('');
                        }}
                    />
                )}
            </div>

            {/* Empty Search Result */}
            {searchTerm === '' ? (
                <div className="mt-20 text-center text-gray-500 p-4">
                    <div className="flex justify-center mb-4">
                        <div className="bg-blue-100 p-5 rounded-full">
                            <img
                                src="https://chat.zalo.me/assets/search_empty_keyword_state.b291c6f32343a363d7bd2d062ba1cf04.png"
                                className="w-[80px]"
                                alt="zalo"
                            />
                        </div>
                    </div>
                    <p>Hãy nhập từ khóa để bắt đầu tìm kiếm tin nhắn và file trong trò chuyện</p>
                </div>
            ) : (
                <div className="p-2 overflow-auto max-h-[calc(100vh_-_150px)]">
                    <TabSearchAll data={data} keyword={searchTerm} scrollToMessage={scrollToMessage} />
                </div>
            )}
        </div>
    );
}

export default TabChatRightBarSearch;
