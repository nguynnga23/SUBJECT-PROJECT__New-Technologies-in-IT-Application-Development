import { useState } from 'react';

export default function PopupReactionChat({ onClose }) {
    const [selectedReaction, setSelectedReaction] = useState('all');

    const reactions = [
        { id: 'all', emoji: '📋', label: 'Tất cả', count: 1 },
        { id: 'heart', emoji: '❤️', label: 'Trái tim', count: 1 },
    ];

    const users = [
        {
            id: 1,
            name: 'Cố vấn/Chiến lược gia',
            avatar: 'https://via.placeholder.com/40',
            reaction: '❤️',
            count: 1,
        },
    ];

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg w-[500px] shadow-lg flex">
                {/* Sidebar */}
                <div className="w-1/3 bg-gray-100 p-4 border-r">
                    <h2 className="text-lg font-semibold mb-2">Biểu cảm</h2>
                    {reactions.map((reaction) => (
                        <div
                            key={reaction.id}
                            onClick={() => setSelectedReaction(reaction.id)}
                            className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${
                                selectedReaction === reaction.id ? 'bg-gray-300' : 'hover:bg-gray-200'
                            }`}
                        >
                            <span>
                                {reaction.emoji} {reaction.label}
                            </span>
                            <span className="text-sm font-semibold">{reaction.count}</span>
                        </div>
                    ))}
                </div>

                {/* Danh sách người dùng */}
                <div className="w-2/3 p-4">
                    {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-2">
                            <div className="flex items-center space-x-2">
                                <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
                                <span className="text-sm">{user.name}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span>{user.reaction}</span>
                                <span className="text-sm font-semibold">{user.count}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-black">
                    ✖
                </button>
            </div>
        </div>
    );
}
