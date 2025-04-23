import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
    removeMemberOfGroupSlice,
    setActiveChat,
    setShowOrOffRightBar,
    setShowOrOffRightBarSearch,
    changeLeaderSlice,
} from '../../redux/slices/chatSlice';
import { changeLeaderRole, kickMember, leaveGroup } from '../../screens/Messaging/api';

function PopupMemberManage({ setShowPopup, leader, member, group }) {
    const dispatch = useDispatch();

    const handleRemoveMember = async (isLeader) => {
        const removeMember = await kickMember(group.id, member.accountId);
        if (removeMember) {
            dispatch(removeMemberOfGroupSlice({ memberId: member.accountId }));
        }
        if (isLeader) {
            dispatch(setActiveChat(null));
            dispatch(setShowOrOffRightBar(false));
            dispatch(setShowOrOffRightBarSearch(false));
        }
    };

    const handleChangeLeader = async (isLeader) => {
        const changeLeader = await changeLeaderRole(group.id, member.accountId);
        // if (changeLeader) {
        //     dispatch(changeLeaderSlice({ memberId: member.accountId }));
        // }
    };

    const handleLeaveGroup = () => {
        // dispatch(removeMemberOfGroup({ memberId: member.id, groupId: group.id }));
        leaveGroup(group.id, member.accountId);
        dispatch(setActiveChat(null));
        dispatch(setShowOrOffRightBar(false));
        dispatch(setShowOrOffRightBarSearch(false));
    };

    const popupRef = useRef(null);

    // Hàm đóng popup khi click bên ngoài
    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowPopup(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setShowPopup]);

    return (
        <div
            className="absolute right-[5px] top-0 w-40 bg-white shadow-lg rounded-lg border z-999 dark:bg-gray-700 dark:text-gray-300 z-10"
            ref={popupRef}
        >
            <div
                onClick={() => {
                    setShowPopup(false);
                }}
                className="my-1 mx-1 rounded-lg"
            >
                {leader ? (
                    <div
                        className="flex-1 p-2 text-sm hover:bg-gray-100 hover:dark:bg-gray-700 cursor-pointer"
                        onClick={handleLeaveGroup}
                    >
                        Rời nhóm
                    </div>
                ) : (
                    <div>
                        <div
                            className="flex-1 p-2 text-sm hover:bg-gray-100 hover:dark:bg-gray-700 cursor-pointer"
                            onClick={() => handleChangeLeader(leader)}
                        >
                            Chuyển trưởng nhóm
                        </div>
                        <div
                            className="flex-1 p-2 text-sm hover:bg-gray-100 hover:dark:bg-gray-700 cursor-pointer"
                            onClick={() => handleRemoveMember(leader)}
                        >
                            Xóa khỏi nhóm
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PopupMemberManage;
