export const handleDeleteMember = (id, setMembers) => {
    setMembers((prevMembers) => prevMembers.filter((member) => member.id !== id));
};

export const handleAddFriend = (id, setFriendRequests) => {
    setFriendRequests((prevRequests) => ({
        ...prevRequests,
        [id]: true, // Đánh dấu đã gửi lời mời kết bạn
    }));
};

export const handleCancelAddFriend = (id, setFriendRequests) => {
    setFriendRequests((prevRequests) => {
        const updatedRequests = { ...prevRequests };
        delete updatedRequests[id]; // Xóa lời mời kết bạn
        return updatedRequests;
    });
};
