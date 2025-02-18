import { use, useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { createGroup, addMemberToGroup } from '../../redux/slices/chatSlice';

const PopupAddGroup = ({ isOpen, onClose, activeChat }) => {
    const dispatch = useDispatch();

    const friend = useSelector((state) => state.friend.friends);
    const [groupName, setGroupName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const existingMembers = activeChat?.group ? activeChat?.members : [];
    const [selectedMembers, setSelectedMembers] = useState(existingMembers);

    if (!isOpen) return null;

    const toggleMember = (member) => {
        if (existingMembers.some((m) => m.id === member.id)) {
            return; // Không thêm nếu đã là thành viên trong nhóm
        }
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
                members: selectedMembers, // Thêm bạn bè vào nhóm
            }),
        );
        clear();
        onClose();
    };
    const handleAddMemberToGroup = () => {
        const selectedFullMembers = selectedMembers.filter((member) => member.id !== 0); // Lọc các member hợp lệ
        dispatch(
            addMemberToGroup({
                groupId: activeChat.id,
                members: selectedFullMembers, // Thêm bạn bè vào nhóm
            }),
        );
        clear();
        onClose();
    };

    const clear = () => {
        setGroupName('');
        setSearchTerm('');
        setSelectedMembers([]);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-[400px] rounded-lg shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-center p-3 border-b border-gray-300">
                    <h2 className="text-lg font-semibold">{activeChat?.group ? 'Thêm thành viên' : 'Tạo nhóm'}</h2>
                    <button
                        onClick={() => {
                            clear();
                            onClose();
                        }}
                    >
                        <IoClose className="text-xl hover:text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4">
                    {/* Nhập tên nhóm */}
                    {!activeChat?.group && (
                        <input
                            type="text"
                            placeholder="Nhập tên nhóm..."
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="w-full border-b border-gray-300 p-2 focus:outline-none"
                        />
                    )}

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
                        {filteredMembers.map((member) => {
                            const isExistingMember = existingMembers.some((m) => m.id === member.id);
                            return (
                                <div
                                    key={member.id}
                                    className={`flex items-center p-2 border-b border-gray-200 ${
                                        isExistingMember
                                            ? 'cursor-not-allowed bg-gray-100'
                                            : 'cursor-pointer hover:bg-gray-100'
                                    }`}
                                    onClick={() => toggleMember(member)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedMembers.some((m) => m.id === member.id) || isExistingMember}
                                        onChange={() => toggleMember(member)}
                                        className="mr-3"
                                    />
                                    <img
                                        className="w-10 h-10 bg-gray-300 rounded-full object-cover"
                                        src={member.avatar}
                                        alt="avatar"
                                    />
                                    <span className="ml-3">{member.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center p-4 border-t border-gray-200 space-x-3">
                    <p className="text-[10px] text-red-500">
                        {activeChat?.group ? 'Tối thiểu 1 thành viên' : 'Tối thiểu 2 thành viên, và xác định group'}
                    </p>
                    <div className="flex">
                        <button
                            onClick={() => {
                                clear();
                                onClose();
                            }}
                            className="px-4 py-2 mr-1 text-white bg-gray-400 rounded-lg"
                        >
                            Hủy
                        </button>
                        {activeChat?.group ? (
                            <button
                                className={`px-4 py-2 text-white rounded-lg ${
                                    selectedMembers.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600'
                                }`}
                                disabled={selectedMembers.length === 0}
                                onClick={handleAddMemberToGroup}
                            >
                                Thêm
                            </button>
                        ) : (
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
                        )}
                        <div />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopupAddGroup;
