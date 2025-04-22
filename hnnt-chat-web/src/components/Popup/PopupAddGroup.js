import { useEffect, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { addMemberToGroup, createGroupChat, uploadFileFormChatGroupToS3 } from '../../screens/Messaging/api';
import { getListFriend } from '../../screens/Contacts/api';
import { updateAvatar } from '../../screens/Profile/api';

const PopupAddGroup = ({ isOpen, onClose, activeChat }) => {
    const dispatch = useDispatch();

    const userActive = useSelector((state) => state.auth.userActive);

    const [groupName, setGroupName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [avatar, setAvatar] = useState('');
    const [preAvatar, setpreAvatar] = useState('');

    const existingMembers = activeChat?.isGroup ? activeChat?.participants : [];
    const [selectedMembers, setSelectedMembers] = useState(existingMembers);

    const [friend, setFriend] = useState([]);
    const fileInputRef = useRef(null);
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const friends = await getListFriend();
                const transformedFriends = friends.map((friend) => ({
                    ...friend,
                    accountId: friend.id,
                }));
                setFriend(transformedFriends);
            } catch (err) {
                console.log(err.message);
            }
        };

        fetchChats();
    }, []);

    if (!isOpen) return null;

    const toggleMember = (member) => {
        if (existingMembers.some((m) => m.accountId === member.accountId)) {
            return; // Không thêm nếu đã là thành viên trong nhóm
        }

        setSelectedMembers((prev) =>
            prev.some((m) => m.accountId === member.accountId)
                ? prev.filter((m) => m.accountId !== member.accountId)
                : [...prev, member],
        );
    };

    const filteredMembers = friend.filter((member) => member.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleCreateGroup = async () => {
        const avatarGroup = await uploadFileFormChatGroupToS3(avatar);
        if (avatarGroup.fileUrl) {
            createGroupChat(groupName, avatarGroup.fileUrl, selectedMembers);
        }
        clear();
        onClose();
    };
    const handleAddMemberToGroup = () => {
        const newMembers = selectedMembers.filter(
            (member) =>
                member.accountId !== userActive.id &&
                !existingMembers.some((existing) => existing.accountId === member.accountId),
        );

        const selectedFullMembers = newMembers.map(
            ({ id, name, avatar, status, account, category, categoryId, readed, priority, ...rest }) => rest,
        );

        addMemberToGroup(activeChat.id, selectedFullMembers);

        clear();
        onClose();
    };

    const clear = () => {
        setGroupName('');
        setSearchTerm('');
        setSelectedMembers([]);
    };

    const handleTakePhoto = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-[400px] rounded-lg shadow-lg  dark:bg-gray-900 dark:text-gray-300">
                {/* Header */}
                <div className="flex justify-between items-center p-3 border-b border-gray-300">
                    <h2 className="text-lg font-semibold">{activeChat?.isGroup ? 'Thêm thành viên' : 'Tạo nhóm'}</h2>
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
                    {!activeChat?.isGroup && (
                        <div className="flex relative group">
                            <div onClick={handleTakePhoto} className="w-[45px] h-[45px] cursor-pointer relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const imageUrl = URL.createObjectURL(file); // Tạo URL tạm thời
                                            setpreAvatar(imageUrl);
                                            setAvatar(file);
                                        }
                                    }}
                                />
                                <img
                                    src={
                                        preAvatar ||
                                        'https://img.freepik.com/premium-vector/chat-vector-icon_676179-133.jpg'
                                    }
                                    alt="avatar"
                                    className="w-[40px] h-[40px] object-cover rounded-full border border-gray-500 absolute"
                                />
                            </div>

                            <input
                                type="text"
                                placeholder="Nhập tên nhóm..."
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                className="w-full border-b border-gray-300 p-2 ml-2 focus:outline-none dark:bg-gray-900 dark:text-gray-300"
                            />
                        </div>
                    )}

                    {/* Ô tìm kiếm */}
                    <input
                        type="text"
                        placeholder="Nhập tên để tìm kiếm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full mt-3 border border-gray-300 p-2 rounded-lg focus:outline-none  dark:bg-gray-900 dark:text-gray-300"
                    />

                    {/* Danh sách thành viên */}
                    <div className="mt-4 h-60 overflow-y-auto">
                        {filteredMembers.map((member) => {
                            const isExistingMember = existingMembers.some((m) => m.accountId === member.accountId);
                            return (
                                <div
                                    key={member.accountId}
                                    className={`flex items-center p-2 border-b border-gray-200 dark:border-b-black ${
                                        isExistingMember
                                            ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-700'
                                            : 'cursor-pointer hover:bg-gray-100 hover:dark:bg-gray-700'
                                    }`}
                                    onClick={() => {
                                        toggleMember(member);
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={
                                            selectedMembers.some((m) => m.accountId === member.accountId) ||
                                            isExistingMember
                                        }
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
                        {activeChat?.isGroup ? 'Tối thiểu 1 thành viên' : 'Tối thiểu 2 thành viên, và xác định group'}
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
                        {activeChat?.isGroup ? (
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
