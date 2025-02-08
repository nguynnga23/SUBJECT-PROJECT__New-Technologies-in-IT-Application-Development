import { useState } from 'react';
import { IoClose } from 'react-icons/io5';

const members = [
    { id: 1, name: 'Nguyễn Văn A', avatar: '' },
    { id: 2, name: 'Nguyễn Văn B', avatar: '' },
    { id: 3, name: 'Nguyễn Văn C', avatar: '' },
    { id: 4, name: 'Nguyễn Văn D', avatar: '' },
    { id: 5, name: 'Nguyễn Văn E', avatar: '' },
    { id: 6, name: 'Nguyễn Văn F', avatar: '' },
    { id: 7, name: 'Nguyễn Văn G', avatar: '' },
];

const PopupAddGroup = ({ isOpen, onClose }) => {
    const [groupName, setGroupName] = useState('');
    const [search, setSearch] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);

    if (!isOpen) return null;

    const toggleMember = (id) => {
        setSelectedMembers((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-[400px] rounded-lg shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-center p-3 border-b border-gray-300">
                    <h2 className="text-lg font-semibold">Tạo nhóm</h2>
                    <button onClick={onClose}>
                        <IoClose className="text-xl hover:text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4">
                    {/* Nhập tên nhóm */}
                    <input
                        type="text"
                        placeholder="Nhập tên nhóm..."
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="w-full border-b border-gray-300 p-2 focus:outline-none"
                    />

                    {/* Ô tìm kiếm */}
                    <input
                        type="text"
                        placeholder="Nhập tên, số điện thoại..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full mt-3 border border-gray-300 p-2 rounded-lg focus:outline-none"
                    />

                    {/* Danh sách thành viên */}
                    <div className="mt-4 h-60 overflow-y-auto">
                        {members
                            .filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
                            .map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                                    onClick={() => toggleMember(member.id)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedMembers.includes(member.id)}
                                        className="mr-3"
                                        readOnly
                                    />
                                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                                    <span className="ml-3">{member.name}</span>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end p-4 border-t border-gray-200 space-x-3">
                    <button onClick={onClose} className="px-4 py-2 text-white bg-gray-400 rounded-lg">
                        Hủy
                    </button>
                    <button
                        className={`px-4 py-2 text-white rounded-lg ${
                            selectedMembers.length > 0 ? 'bg-blue-600' : 'bg-gray-300 cursor-not-allowed'
                        }`}
                        disabled={selectedMembers.length === 0}
                    >
                        Tạo nhóm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopupAddGroup;
