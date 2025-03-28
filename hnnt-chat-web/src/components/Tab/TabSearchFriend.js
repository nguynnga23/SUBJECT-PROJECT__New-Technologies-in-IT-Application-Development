import { useDispatch } from 'react-redux';
import { setActiveChat } from '../../redux/slices/chatSlice';
import { getChatByUser } from '../../screens/Messaging/api';

function TabSearchFriend({ data, keyword }) {
    const highlightKeyword = (content, keyword) => {
        if (!keyword.trim()) return content; // Nếu không có keyword thì trả về nguyên content
        const regex = new RegExp(`(${keyword})`, 'gi'); // Regex tìm từ khóa (không phân biệt hoa/thường)
        return content.replace(regex, `<mark class="bg-blue-300">${keyword}</mark>`);
    };

    const dispatch = useDispatch();

    return (
        <div className="mt-1 overflow-auto dark:bg-gray-800 dark:text-gray-300">
            {data.map((r, index) => (
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
        </div>
    );
}

export default TabSearchFriend;
