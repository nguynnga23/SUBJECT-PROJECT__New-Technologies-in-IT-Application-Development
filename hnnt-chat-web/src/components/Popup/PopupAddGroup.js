import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { createGroup } from '../../redux/slices/chatSlice';

const PopupAddGroup = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();

    const friend = useSelector((state) => state.friend.friends);
    const [groupName, setGroupName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);

    if (!isOpen) return null;

    const toggleMember = (member) => {
        setSelectedMembers((prev) =>
            prev.some((m) => m.id === member.id) ? prev.filter((m) => m.id !== member.id) : [...prev, member],
        );
    };

    const filteredMembers = friend.filter((member) => member.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleCreateGroup = () => {
        dispatch(
            createGroup({
                name: groupName,
                avatar: 'https://cdn-icons-png.flaticon.com/512/6387/6387947.png',
                members: selectedMembers, // Thêm tất cả bạn bè vào nhóm
            }),
        );
        onClose();
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
                        placeholder="Nhập tên để tìm kiếm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full mt-3 border border-gray-300 p-2 rounded-lg focus:outline-none"
                    />

                    {/* Danh sách thành viên */}
                    <div className="mt-4 h-60 overflow-y-auto">
                        {filteredMembers
                            .filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                                    onClick={() => toggleMember(member)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedMembers.some((m) => m.id === member.id)}
                                        className="mr-3"
                                        readOnly
                                    />
                                    <img
                                        className="w-10 h-10 bg-gray-300 rounded-full object-cover"
                                        src={member.avatar}
                                        alt="avatar"
                                    />
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
                            groupName.trim() && selectedMembers.length >= 2
                                ? 'bg-blue-600'
                                : 'bg-gray-300 cursor-not-allowed'
                        }`}
                        disabled={!groupName.trim() || selectedMembers.length < 2}
                        onClick={handleCreateGroup}
                    >
                        Tạo nhóm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopupAddGroup;
