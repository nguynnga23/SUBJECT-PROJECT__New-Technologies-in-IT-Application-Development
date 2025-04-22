import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveChat, setShowOrOffRightBar, setShowOrOffRightBarSearch } from '../../redux/slices/chatSlice';
import { kickMember, leaveGroup } from '../../screens/Messaging/api';

function PopupMemberManage({ setShowPopup, leader, member, group }) {
    const dispatch = useDispatch();

    const handleRemoveMember = (isLeader) => {
        // dispatch(removeMemberOfGroup({ memberId: member.id, groupId: group.id }));
        kickMember(group.id, member.accountId);
        if (isLeader) {
            dispatch(setActiveChat(null));
            dispatch(setShowOrOffRightBar(false));
            dispatch(setShowOrOffRightBarSearch(false));
        }
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
            className="absolute right-[5px] top-0 w-40 bg-white shadow-lg rounded-lg border z-999 dark:bg-gray-700 dark:text-gray-300"
            ref={popupRef}
        >
            <div
                onClick={() => {
                    setShowPopup(false);
                }}
                className="flex items-center my-1 hover:bg-gray-100 hover:dark:bg-gray-700 rounded-lg cursor-pointer"
            >
                {leader ? (
                    <span className="flex-1 my-1 text-sm text-center" onClick={handleLeaveGroup}>
                        Rời nhóm
                    </span>
                ) : (
                    <span className="flex-1 my-1 text-sm text-center" onClick={() => handleRemoveMember(leader)}>
                        Xóa khỏi nhóm
                    </span>
                )}
            </div>
        </div>
    );
}

export default PopupMemberManage;
