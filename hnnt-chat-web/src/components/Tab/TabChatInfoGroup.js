import { IoChevronBack } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { RiKey2Line } from 'react-icons/ri';
import { useRef, useState } from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';
import PopupMemberManage from '../Popup/PopupMemberManage';

function TabChatInfoGroup({ setActiveMessageTab, group }) {
    const userActive = useSelector((state) => state.auth.userActive);
    const userId = userActive.id;
    const [showPopup, setShowPopup] = useState(false);
    const [hoveredMember, setHoveredMember] = useState(null);
    const timeoutRef = useRef(null);
    return (
        <div className="overflow-auto">
            <div className="flex relative border-b p-4 items-center justify-center">
                <IoChevronBack
                    size={25}
                    className="absolute left-[12px] top-[18px] rounded-full hover:bg-gray-100 p-1"
                    onClick={() => setActiveMessageTab('info')}
                />
                <p className="font-medium">Thành viên</p>
            </div>
            <div>
                {group?.members?.map((g, index) => (
                    <div
                        className="relative flex item-center p-3  hover:bg-gray-100 cursor-pointer"
                        key={index}
                        onMouseEnter={() => {
                            if (timeoutRef.current) {
                                // Hủy bỏ timeout nếu chuột quay lại
                                clearTimeout(timeoutRef.current);
                                !showPopup && setHoveredMember(index);
                            }
                        }}
                        onMouseLeave={() => {
                            timeoutRef.current = setTimeout(() => {
                                setHoveredMember(null);
                                setShowPopup(false);
                            }, 500);
                        }}
                    >
                        <div className="relative">
                            <img
                                src={g.avatar} // Thay bằng avatar thật
                                alt="avatar"
                                className="w-[45px] h-[45px] rounded-full border mr-3 object-cover"
                            />
                            {g.id === group?.leader && (
                                <RiKey2Line
                                    size={15}
                                    color="yellow"
                                    className="absolute bottom-[0px] right-[10px] bg-gray-500  bg-opacity-50 rounded-full p-[2px]"
                                />
                            )}
                        </div>

                        <div>
                            {g.id === userId ? (
                                <h3 className="font-medium text-xs text-lg mt-1 max-w-[270px] truncate">Bạn</h3>
                            ) : (
                                <h3 className="font-medium text-xs text-lg mt-1 max-w-[270px] truncate">{g.name}</h3>
                            )}
                            {g.id === group?.leader && (
                                <p className=" text-xs text-lg mt-1 max-w-[270px] truncate">Trưởng nhóm</p>
                            )}
                        </div>
                        <div className="absolute top-[5px] right-[0px]">
                            {hoveredMember === index && userId === group.leader && (
                                <div className="relative ">
                                    <FiMoreHorizontal
                                        size={13}
                                        className="m-2 text-gray-500 hover:bg-blue-200 rounded-[2px]"
                                        onClick={() => setShowPopup(true)}
                                    />
                                    {showPopup && hoveredMember === index && (
                                        <PopupMemberManage
                                            setShowPopup={setShowPopup}
                                            setHoveredMember={setHoveredMember}
                                            userActive={userActive}
                                            leader={g.id === group?.leader}
                                            member={g}
                                            group={group}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TabChatInfoGroup;
