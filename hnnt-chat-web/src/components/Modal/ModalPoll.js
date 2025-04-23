import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleModal } from '../../redux/slices/modalSlice';
import { createPoll } from '../../screens/Polls/api';
import { sendMessage } from '../../screens/Messaging/api';
import { MdSignalWifiStatusbarNull } from 'react-icons/md';
import { socket } from '../../configs/socket';

function ModalPoll() {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    // const [multipleChoice, setMultipleChoice] = useState(true);
    // const [allowAddOption, setAllowAddOption] = useState(true);
    // const [pinToTop, setPinToTop] = useState(false);
    // const [hideResults, setHideResults] = useState(false);
    // const [hideVoters, setHideVoters] = useState(false);
    // const [date, setDate] = useState('');

    const dispatch = useDispatch();
    const userActive = useSelector((state) => state.auth.userActive);
    const userId = userActive.id;

    const activeChat = useSelector((state) => state.chat.activeChat);
    const chatId = activeChat?.id;

    const addOption = () => setOptions([...options, '']);

    const updateOption = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleCreatePoll = async () => {
        const formattedOptions = options.map((option) => ({ text: option }));
        try {
            const data = await createPoll(chatId, userId, question, null, formattedOptions);
            if (data) {
                const sendMess = await sendMessage(chatId, 'polls', 'polls', null, null, null, null);
                socket.emit('send_message', {
                    chatId: chatId,
                    newMessage: sendMess,
                });
                dispatch(toggleModal()); // Đóng modal sau khi tạo bình chọn thành công
            }
        } catch (error) {
            console.error('Lỗi khi tạo bình chọn:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Tạo bình chọn</h2>

                <div className="flex">
                    {/* Chủ đề bình chọn */}
                    <div>
                        <label className="block font-medium mb-1">Chủ đề bình chọn</label>
                        <textarea
                            placeholder="Đặt câu hỏi bình chọn"
                            maxLength={200}
                            rows={3}
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="w-full p-3 border-2 border-blue-600 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 mb-2"
                        />
                        <div className="text-right text-sm text-gray-500 mb-4">{question.length}/200</div>

                        {/* Các lựa chọn */}
                        <label className="block font-medium mb-1">Các lựa chọn</label>
                        {options.map((opt, index) => (
                            <input
                                key={index}
                                placeholder={`Lựa chọn ${index + 1}`}
                                value={opt}
                                onChange={(e) => updateOption(index, e.target.value)}
                                className="w-full mb-2 p-2 border border-gray-300 rounded"
                            />
                        ))}
                        <button
                            type="button"
                            onClick={addOption}
                            className="text-blue-600 text-sm font-medium hover:underline mb-4"
                        >
                            + Thêm lựa chọn
                        </button>
                    </div>

                    {/* Thời hạn bình chọn và thiết lập nâng cao */}
                    {/* 
                    <div className="grid grid-cols-1 gap-6 ml-3">
                        <div className="relative">
                            <label className="block font-medium mb-1">Thời hạn bình chọn</label>
                            <input
                                type="date"
                                value={date}
                                onChange={handleDateChange}
                                placeholder="Không thời hạn"
                                className="w-full p-2 border border-gray-300 rounded pr-10"
                                min={new Date().toISOString().split('T')[0]} // Đặt ngày tối thiểu là ngày hôm nay
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-2">Thiết lập nâng cao</label>
                            <Toggle label="Ghim lên đầu trò chuyện" value={pinToTop} onChange={setPinToTop} />
                            <Toggle label="Chọn nhiều phương án" value={multipleChoice} onChange={setMultipleChoice} />
                            <Toggle label="Có thể thêm phương án" value={allowAddOption} onChange={setAllowAddOption} />
                        </div>

                        <div>
                            <label className="block font-medium mb-2">Bình chọn ẩn danh</label>
                            <Toggle
                                label="Ẩn kết quả khi chưa bình chọn"
                                value={hideResults}
                                onChange={setHideResults}
                            />
                            <Toggle label="Ẩn người bình chọn" value={hideVoters} onChange={setHideVoters} />
                        </div>
                    </div>
                    */}
                </div>

                {/* Nút */}
                <div className="flex justify-between items-center mt-6">
                    <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => dispatch(toggleModal())}>
                        Hủy
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        disabled={!question || options.some((opt) => !opt)}
                        onClick={handleCreatePoll}
                    >
                        Tạo bình chọn
                    </button>
                </div>
            </div>
        </div>
    );
}

// Toggle component
function Toggle({ label, value, onChange }) {
    return (
        <label className="flex items-center justify-between mb-2 cursor-pointer">
            <span>{label}</span>
            <input type="checkbox" checked={value} onChange={() => onChange(!value)} className="toggle-checkbox" />
        </label>
    );
}

export default ModalPoll;
