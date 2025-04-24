import { FaTrashAlt } from 'react-icons/fa';
import { GoBell } from 'react-icons/go';
import { GrPin } from 'react-icons/gr';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { GoBellSlash } from 'react-icons/go';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosLogOut } from 'react-icons/io';
import { AiOutlineUsergroupDelete } from 'react-icons/ai';
import { RxAvatar } from 'react-icons/rx';

import {
    setActiveChat,
    setShowOrOffRightBar,
    setShowOrOffRightBarSearch,
    setOnOrOfPin,
    setOnOrOfNotify,
    setAvatarForGroupChat,
    updateGroupName,
} from '../../redux/slices/chatSlice';
import { useEffect, useRef, useState } from 'react';
import Archive from '../Archive/Archive';
import PopupAddGroup from '../Popup/PopupAddGroup';
import {
    changeNameGroup,
    deleteAllChatOfChat,
    disbandGroup,
    editAvatar,
    getMessage,
    leaveGroup,
    notifyChatOfUser,
    pinChatOfUser,
    sendMessage,
    uploadFileFormChatGroupToS3,
} from '../../screens/Messaging/api';

function TabChatInfo({ setActiveMessageTab }) {
    const userActive = useSelector((state) => state.auth.userActive);
    const userId = userActive?.id;
    const activeChat = useSelector((state) => state.chat.activeChat);
    const chatId = activeChat?.id;
    const [addGroupButton, setAddGroupButton] = useState(false);

    const [data, setData] = useState([]);

    const [memberOpen, setMemberOpen] = useState(true);
    const [fileOpen, setFileOpen] = useState(true);
    const [imageOpen, setImageOpen] = useState(true);
    const [linkOpen, setLinkOpen] = useState(true);
    const [groupNewsOpen, setGroupNewsOpen] = useState([]);

    const fileInputRef = useRef(null);
    const leader = activeChat?.participants?.find((g) => g.role === 'LEADER');
    const isGroupLeader = leader?.accountId === userId;

    const dispatch = useDispatch();

    const [groupName, setGroupName] = useState(activeChat?.name || '');

    const handleGroupNameChange = async () => {
        if (groupName.trim() && groupName !== activeChat?.name) {
            // Gửi API đổi tên nhóm ở đây
            const saveGroupName = await changeNameGroup(activeChat.id, groupName);
            if (saveGroupName) {
                dispatch(updateGroupName({ name: groupName }));
                await sendMessage(
                    chatId,
                    `${userActive.name} đã đổi tên nhóm thành ${groupName}`,
                    'notify',
                    null,
                    null,
                    null,
                    null,
                );
            }
        }
    };

    const handleLeaveGroup = async () => {
        const leave = await leaveGroup(chatId, userId);
        if (leave) {
            await sendMessage(chatId, `${userActive.name} đã rời nhóm`, 'notify', null, null, null, null);
        }

        dispatch(setActiveChat(null));
        dispatch(setShowOrOffRightBar(false));
        dispatch(setShowOrOffRightBarSearch(false));
    };

    const handleDeleteGroup = () => {
        disbandGroup(chatId);
        dispatch(setActiveChat(null));
        dispatch(setShowOrOffRightBar(false));
        dispatch(setShowOrOffRightBarSearch(false));
    };

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const chats = await getMessage(chatId);
                setData(chats);
            } catch (err) {
                console.log(err.message);
            }
        };

        fetchMessages();
    }, [chatId, activeChat]);

    const pinMessage = (chatId, userId, pinStatus) => {
        pinChatOfUser(chatId);
        dispatch(
            setOnOrOfPin({
                chatId,
                userId,
                pinStatus,
            }),
        );
    };
    const notifyMessage = (chatId, userId, notifyStatus) => {
        notifyChatOfUser(chatId);
        dispatch(
            setOnOrOfNotify({
                chatId,
                userId,
                notifyStatus,
            }),
        );
    };

    const handleTakePhoto = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="overflow-auto dark:text-gray-300">
            {/* Avatar + Tên nhóm */}
            <div className="flex flex-col items-center p-3">
                <img
                    src={
                        activeChat?.isGroup
                            ? activeChat?.avatar
                            : activeChat?.participants?.find((user) => user.accountId !== userId)?.account.avatar
                    }
                    alt="avatar"
                    className="w-[55px] h-[55px] rounded-full border object-cover"
                />
                <h3 className="font-bold text-lg mt-2 font-medium">
                    {activeChat?.isGroup ? (
                        isGroupLeader ? (
                            <input
                                className="font-bold text-lg mt-2 font-medium bg-transparent border-b border-gray-300 outline-none text-center"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                onBlur={handleGroupNameChange}
                            />
                        ) : (
                            <h3 className="font-bold text-lg mt-2 font-medium">{activeChat?.name}</h3>
                        )
                    ) : (
                        <h3 className="font-bold text-lg mt-2 font-medium">
                            {activeChat?.participants?.find((user) => user.accountId !== userId)?.account?.name ||
                                'Người dùng'}
                        </h3>
                    )}
                </h3>
            </div>
            <div className="flex item-center justify-center border-b-[7px] dark:border-b-gray-900 ">
                <div className="m-4 mt-1 w-[50px] text-center">
                    <div className="flex justify-center">
                        {activeChat.participants?.find((user) => user.accountId === userId)?.notify ? (
                            <GoBell
                                size={35}
                                className="p-2 bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer"
                                onClick={() => notifyMessage(chatId, userId, false)}
                            />
                        ) : (
                            <GoBellSlash
                                size={35}
                                className="p-2 bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer text-blue-500"
                                onClick={() => notifyMessage(chatId, userId, true)}
                            />
                        )}
                    </div>
                    <p className="text-[10px]"> {activeChat?.notify ? 'Tắt thông báo' : 'Bật thông báo'}</p>
                </div>
                <div className="m-4 mt-1 w-[50px] text-center">
                    <div className="flex justify-center">
                        {!activeChat.participants?.find((user) => user.accountId === userId)?.pin ? (
                            <GrPin
                                size={35}
                                className="p-2 bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer"
                                onClick={() => pinMessage(chatId, userId, true)}
                            />
                        ) : (
                            <GrPin
                                size={35}
                                className="p-2 bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer text-blue-500"
                                onClick={() => pinMessage(chatId, userId, false)}
                            />
                        )}
                    </div>
                    <p className="text-[10px]"> {!activeChat?.pin ? 'Ghim hội thoại' : 'Bỏ ghim hội thoại'}</p>
                </div>
                {activeChat?.isGroup &&
                    activeChat.participants?.find((user) => user.accountId === userId)?.role === 'LEADER' && (
                        <div className="m-4 mt-1 w-[50px] text-center">
                            <div>
                                <div className="flex justify-center" onClick={handleTakePhoto}>
                                    <RxAvatar
                                        size={35}
                                        className="p-2 bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer"
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                try {
                                                    const upload = await uploadFileFormChatGroupToS3(file);
                                                    if (upload) {
                                                        const saveAvatar = await editAvatar(upload.fileUrl, chatId);
                                                        if (saveAvatar) {
                                                            dispatch(setAvatarForGroupChat({ avatar: upload.fileUrl }));
                                                        }
                                                    }
                                                } catch (error) {
                                                    console.log('Lỗi khi cập nhật avatar');
                                                }
                                            }
                                        }}
                                    />
                                </div>
                                <p className="text-[10px]">Đổi avatar</p>
                            </div>
                        </div>
                    )}
                <div className="m-4 mt-1 w-[50px] text-center">
                    {activeChat?.isGroup ? (
                        <div>
                            <div className="flex justify-center">
                                <AiOutlineUsergroupAdd
                                    size={35}
                                    className="p-2 bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer"
                                    onClick={() => setAddGroupButton(true)}
                                />
                                <PopupAddGroup
                                    isOpen={addGroupButton}
                                    onClose={() => setAddGroupButton(false)}
                                    activeChat={activeChat}
                                />
                            </div>

                            <p className="text-[10px]">Thêm thành viên</p>
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-center">
                                <AiOutlineUsergroupAdd
                                    size={35}
                                    className="p-2 bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer"
                                    onClick={() => setAddGroupButton(true)}
                                />
                                <PopupAddGroup
                                    isOpen={addGroupButton}
                                    onClose={() => setAddGroupButton(false)}
                                    activeChat={activeChat}
                                />
                            </div>
                            <p className="text-[10px]">Tạo nhóm trò chuyện</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Danh mục */}
            <div className="space-y-2 ">
                {activeChat?.isGroup && (
                    <Archive
                        title="Thành viên"
                        isOpen={memberOpen}
                        toggleOpen={() => setMemberOpen(!memberOpen)}
                        messages={data}
                        type="member"
                        group={activeChat?.participants}
                        setActiveMessageTab={setActiveMessageTab}
                    />
                )}
                {activeChat?.isGroup && (
                    <Archive
                        title="Bảng tin nhóm"
                        isOpen={groupNewsOpen}
                        toggleOpen={() => setGroupNewsOpen(!groupNewsOpen)}
                        messages={data}
                        type="groupNews"
                        group={activeChat?.participants}
                        setActiveMessageTab={setActiveMessageTab}
                    />
                )}
                <Archive
                    title="Ảnh"
                    isOpen={imageOpen}
                    toggleOpen={() => setImageOpen(!imageOpen)}
                    messages={data}
                    type="image"
                />
                <Archive
                    title="File"
                    isOpen={fileOpen}
                    toggleOpen={() => setFileOpen(!fileOpen)}
                    messages={data}
                    type="file"
                />
                <Archive
                    title="Link"
                    isOpen={linkOpen}
                    toggleOpen={() => setLinkOpen(!linkOpen)}
                    messages={data}
                    type="link"
                />
            </div>

            {/* Xóa lịch sử trò chuyện */}
            <div className="text-red-500 flex items-center space-x-2 py-3 font-medium cursor-pointer text-base pl-2 hover:bg-gray-100 hover:dark:bg-gray-700">
                <FaTrashAlt />
                <span className="text-[12px]" onClick={() => deleteAllChatOfChat(chatId)}>
                    Xóa lịch sử trò chuyện
                </span>
            </div>
            {activeChat?.isGroup && (
                <div className="text-red-500 flex items-center space-x-2 py-3 font-medium cursor-pointer text-base pl-2 hover:bg-gray-100 hover:dark:bg-gray-700">
                    <IoIosLogOut />
                    <span className="text-[12px]" onClick={handleLeaveGroup}>
                        Rời nhóm
                    </span>
                </div>
            )}
            {activeChat?.isGroup &&
                activeChat.participants?.find((user) => user.accountId === userId)?.role === 'LEADER' && (
                    <div className="text-red-500 flex items-center space-x-2 py-3 font-medium cursor-pointer text-base pl-2 hover:bg-gray-100 hover:dark:bg-gray-700">
                        <AiOutlineUsergroupDelete />
                        <span className="text-[12px]" onClick={handleDeleteGroup}>
                            Giải tán nhóm
                        </span>
                    </div>
                )}
        </div>
    );
}

export default TabChatInfo;
