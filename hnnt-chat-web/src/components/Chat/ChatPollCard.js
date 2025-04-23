import { useDispatch, useSelector } from 'react-redux';
import { getPolls } from '../../screens/Polls/api';
import { useEffect, useState } from 'react';
import { setShowModalVotePoll, setValueModalVotePoll } from '../../redux/slices/modalSlice';

function ChatPollCard() {
    const [data, setData] = useState([]);

    const activeChat = useSelector((state) => state.chat.activeChat);
    const chatId = activeChat?.id;

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const polls = await getPolls(chatId);
                setData(polls);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách bình chọn:', error);
            }
        };

        fetchPolls();
    });

    return (
        <>
            {data.map((item) => (
                <div className="w-full p-4 bg-white rounded-xl shadow-md border border-gray-200">
                    <h2 className="text-lg font-semibold mb-1">{item?.title}</h2>
                    <p className="text-sm text-gray-500 mb-1">Kết thúc lúc {item?.endsAt}</p>
                    <p className="text-sm text-gray-600 mb-4">Chọn nhiều phương án</p>

                    <div className="space-y-2 mb-4">
                        {item?.options.map((option, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center px-3 py-2 bg-gray-100 rounded text-sm"
                            >
                                <span>{option.text}</span>
                                <span>{option.votes.lengh}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        className="w-full border border-blue-500 text-blue-600 font-medium py-2 rounded hover:bg-blue-50"
                        onClick={() => {
                            dispatch(setShowModalVotePoll(true));
                            dispatch(setValueModalVotePoll(item));
                        }}
                    >
                        Bình chọn
                    </button>
                </div>
            ))}
        </>
    );
}

export default ChatPollCard;
