import { FaTrashAlt } from 'react-icons/fa';

function TabChatInfo({ selectedChat }) {
    return (
        <div className="">
            {/* Avatar + Tên nhóm */}
            <div className="flex flex-col items-center mb-4 p-3">
                <img src={selectedChat.avatar} className="w-[55px] h-[55px] rounded-full border object-cover" />
                <h3 className="font-bold text-lg mt-2 font-bold">{selectedChat.name}</h3>
            </div>

            {/* Danh mục */}
            <div className="space-y-2">
                <div className="p-2 border-b-[7px]">
                    <div className="flex justify-between items-center pl-2">
                        <span className=" font-medium cursor-pointer text-base ">Ảnh/Video</span>
                        <span className=" font-medium text-base">{'>'}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 font-medium text-[10px] pl-2">
                        Chưa có Ảnh/Video được chia sẻ trong hội thoại này
                    </p>
                </div>
                <div className="p-2 border-b-[7px]">
                    <div className="flex justify-between items-center pl-2">
                        <span className="font-medium cursor-pointer text-base ">File</span>
                        <span className=" font-medium text-base">{'>'}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 font-medium text-[10px] pl-2">
                        Chưa có File được chia sẻ trong hội thoại này
                    </p>
                </div>
                <div className="items-center p-2 border-b-[7px] cursor-pointer">
                    <div className="flex justify-between items-center pl-2">
                        <span className="text-gray-600 font-medium text-base">Link</span>
                        <span className="font-medium text-base">{'>'}</span>
                    </div>

                    <p className="text-xs text-gray-400 mt-1 font-medium text-[10px] pl-2">
                        Chưa có Link được chia sẻ trong hội thoại này
                    </p>
                </div>
            </div>

            {/* Xóa lịch sử trò chuyện */}
            <div className="mt-4 text-red-500 flex items-center space-x-2 font-medium cursor-pointer text-base pl-2">
                <FaTrashAlt />
                <span>Xóa lịch sử trò chuyện</span>
            </div>
        </div>
    );
}

export default TabChatInfo;
