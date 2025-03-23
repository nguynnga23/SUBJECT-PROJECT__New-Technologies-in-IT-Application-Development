import { CiCircleRemove } from 'react-icons/ci';

export default function PopupReactionChat({ onClose, reactions }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-[12px]">
            <div className="bg-white relative rounded-lg  w-[350px] shadow-lg">
                {/* Sidebar */}
                <div className=" rounded-lg bg-gray-100 p-4 border-b">
                    <h2 className="text-[14px] font-semibold ">Biểu cảm</h2>
                    <CiCircleRemove
                        className="absolute top-[-30px] right-[-30px] text-white text-3xl cursor-pointer"
                        onClick={() => onClose(false)}
                    />
                </div>

                {/* Danh sách người dùng */}
                <div className="p-4 max-h-[350px] overflow-auto">
                    {reactions.map((reaction, index) => (
                        <div key={index} className="flex items-center justify-between p-1">
                            <div className="flex items-center space-x-2">
                                <img
                                    src={reaction.user.avatar}
                                    alt="Avatar"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <span className="text-[12px]">{reaction.user.name}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span>{reaction.reaction}</span>
                                <span className="text-sm font-semibold">{reaction.sum}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
