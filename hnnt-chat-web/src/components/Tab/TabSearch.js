import { useState } from 'react';
import TabSearchAll from './TabSearchAll';
import TabSearchMessage from './TabSearchMessage';
import TabSearchFile from './TabSearchFile';
import TabSearchFriend from './TabSearchFriend';

const tabs = ['Tất cả', 'Liên lạc', 'Tin nhắn', 'File'];

function TabSearch({ keyword, data, dataContact }) {
    const [activeSearchTab, setActiveSearchTab] = useState('Tất cả');
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
    return (
        <div className="p-4 pt-1 dark:bg-gray-800 ">
            <div className="flex border-b dark:border-b-black ">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`flex-1 text-sm text-gray-600 dark:text-gray-300 px-2 py-1 ${
                            activeSearchTab === tab ? 'text-blue-600 border-b-2  border-blue-600 font-medium' : ''
                        }`}
                        onClick={() => {
                            setActiveSearchTab(tab);
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <div className="overflow-auto max-h-[calc(100vh_-_110px)]">
                {activeSearchTab === 'Tất cả' && (
                    <TabSearchAll
                        data={data}
                        dataContact={dataContact}
                        keyword={keyword}
                        scrollToMessage={scrollToMessage}
                    />
                )}
                {activeSearchTab === 'Tin nhắn' && (
                    <TabSearchMessage data={data} keyword={keyword} scrollToMessage={scrollToMessage} />
                )}
                {activeSearchTab === 'File' && (
                    <TabSearchFile data={data} keyword={keyword} scrollToMessage={scrollToMessage} />
                )}
                {activeSearchTab === 'Liên lạc' && (
                    <TabSearchFriend data={dataContact} keyword={keyword} scrollToMessage={scrollToMessage} />
                )}
            </div>
        </div>
    );
}

export default TabSearch;
