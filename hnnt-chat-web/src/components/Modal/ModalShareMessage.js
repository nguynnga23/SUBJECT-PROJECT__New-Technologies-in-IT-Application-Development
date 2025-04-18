import { useEffect, useState } from 'react';
import { getListFriend } from '../../screens/Contacts/api';
import { useSelector } from 'react-redux';
import { getChatByUser, sendMessage } from '../../screens/Messaging/api';
import { socket } from '../../configs/socket';

const ModalShareMessage = ({ setShowModalShareMes, message }) => {
    const [selected, setSelected] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const activeChat = useSelector((state) => state.chat.activeChat);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const data = await getListFriend();
                setContacts(data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách bạn bè', error);
            }
        };

        fetchContacts();
    });

    const toggleSelect = (name) => {
        setSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
    };

    const handleShareMessage = async () => {
        for (const userId of selected) {
            const data = await getChatByUser(userId);
            console.log(`ID của cuộc trò chuyện với ${userId}:`, data);

            const sendMess = await sendMessage(
                data?.id,
                message?.content,
                message.type,
                message.replyToId,
                null,
                null,
                null,
            );

            socket.emit('send_message', {
                chatId: data?.id,
                newMessage: sendMess,
            });
        }

        console.log('Selected:', activeChat);

        setShowModalShareMes(false);
    };

    const filteredContacts = contacts.filter((contact) =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        // Overlay
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            {/* Modal box */}
            <div className="w-[500px] max-w-full border rounded-xl p-4 bg-white shadow-lg">
                <h2 className="text-xl font-semibold mb-3">Chia sẻ</h2>

                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="w-full border px-3 py-2 mb-3 rounded"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="mb-2 text-sm text-blue-600 font-semibold">Gần đây</div>
                <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
                    {filteredContacts.map((items, idx) => (
                        <label key={idx} className="flex items-center space-x-2 cursor-pointer">
                            <div>
                                <img src={items?.avatar} className="h-[50px] w-[50px] rounded-full" />
                            </div>
                            <input
                                type="checkbox"
                                checked={selected.includes(items?.id)}
                                onChange={() => toggleSelect(items?.id)}
                            />
                            <span>{items?.name}</span>
                        </label>
                    ))}
                </div>

                <div className="border-t pt-3">
                    <div className="bg-gray-100 p-3 rounded mb-2">{message?.content}</div>
                    <input
                        type="text"
                        placeholder="Nhập tin nhắn..."
                        className="w-full border px-3 py-2 mb-3 rounded"
                    />
                    <div className="flex justify-end space-x-2">
                        <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowModalShareMes(false)}>
                            Hủy
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                            disabled={selected.length === 0}
                            onClick={handleShareMessage}
                        >
                            Chia sẻ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalShareMessage;
