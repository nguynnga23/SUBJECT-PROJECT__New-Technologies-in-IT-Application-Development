import { formatDistanceToNow, format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useDispatch } from 'react-redux';
import { setActiveChat } from '../../redux/slices/chatSlice';
import { getChatById, getChatByUser } from '../../screens/Messaging/api';

function TabSearchAll({ data, dataContact, keyword, scrollToMessage }) {
    const highlightKeyword = (content, keyword) => {
        if (!keyword.trim()) return content; // Nếu không có keyword thì trả về nguyên content
        const regex = new RegExp(`(${keyword})`, 'gi'); // Regex tìm từ khóa (không phân biệt hoa/thường)
        return content.replace(regex, `<mark class="bg-blue-300">$1</mark>`); // Dùng $1 để tránh lỗi XSS
    };

    const formatTime = (time) => {
        const date = new Date(time);
        const now = new Date();

        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            return formatDistanceToNow(date, { addSuffix: true, locale: vi }); // "2 phút trước", "1 giờ trước"
        } else if (diffInDays === 1) {
            return 'Hôm qua';
        } else {
            return format(date, 'dd/MM/yyyy', { locale: vi }); // Hiển thị ngày gửi
        }
    };

    const dispatch = useDispatch();

    const renderResults = (type, label) => {
        const filteredResults = data.filter((r) => r?.type === type);
        if (filteredResults.length === 0) return null; // Nếu không có kết quả thì không render

        return (
            <>
                <div>
                    <p className="font-medium text-[13px]">{label}</p>
                    {filteredResults.map((r, index) => (
                        <div
                            key={index}
                            className="relative flex items-center p-2 hover:bg-gray-200 dark:hover:bg-gray-500 cursor-pointer"
                            onClick={async () => {
                                const activeChat = await getChatById(r.chatId);
                                dispatch(setActiveChat(activeChat));
                                scrollToMessage(r.id);
                            }}
                        >
                            <img
                                src={r.sender.avatar}
                                alt="avatar"
                                className="w-[35px] h-[35px] object-cover rounded-full mr-2"
                            />
                            <div>
                                <p className="font-medium text-[12px] mb-[2px]">{r.sender.name}</p>
                                <p
                                    className="text-[12px] max-w-[200px] truncate"
                                    dangerouslySetInnerHTML={{
                                        __html: highlightKeyword(type === 'text' ? r.content : r.fileName, keyword),
                                    }}
                                ></p>
                                <p className="absolute right-[10px] top-[5px] text-[12px] mb-[2px]">
                                    {r.time && formatTime(r.time)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    };

    return (
        <div className="mt-1 overflow-auto dark:bg-gray-800 dark:text-gray-300">
            {dataContact && <p className="font-medium text-[13px]">Liên lạc</p>}
            {dataContact?.map((r, index) => (
                <div
                    className="relative flex items-center p-2 hover:bg-gray-200 hover:dark:bg-gray-500 cursor-pointer "
                    key={index}
                    onClick={async () => {
                        const activeChat = await getChatByUser(r.id);
                        dispatch(setActiveChat(activeChat));
                    }}
                >
                    <img src={r.avatar} alt="avatar" className="w-[35px] h-[35px] object-cover rounded-full mr-2" />
                    <div>
                        <p
                            className="font-medium text-[12px] mb-[2px]"
                            dangerouslySetInnerHTML={{ __html: highlightKeyword(r.name, keyword) }}
                        ></p>
                    </div>
                </div>
            ))}
            {renderResults('text', 'Tin nhắn')}
            {renderResults('file', 'File')}
        </div>
    );
}

export default TabSearchAll;
