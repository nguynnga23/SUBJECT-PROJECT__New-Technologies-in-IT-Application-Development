import { useState, useEffect, useRef } from 'react';

function PopupMemberManage({ setShowPopup, setHoveredMember, userActive, leader }) {
    const userId = userActive.id;

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
    }, []);

    return (
        <div className="absolute right-[5px] top-0 w-40 bg-white shadow-lg rounded-lg border z-999" ref={popupRef}>
            <div
                onClick={() => {
                    setShowPopup(false);
                }}
                className="flex items-center my-1 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
                {leader ? (
                    <span className="flex-1 my-1 text-sm text-center">Rời nhóm</span>
                ) : (
                    <span className="flex-1 my-1 text-sm text-center">Xóa khỏi nhóm</span>
                )}
            </div>
        </div>
    );
}

export default PopupMemberManage;
