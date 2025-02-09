import { FaTrashAlt } from 'react-icons/fa';

function TabChatInfo({ selectedChat }) {
    return (
        <div className="p-4">
            {/* Avatar + Tên nhóm */}
            <div className="flex flex-col items-center mb-4">
                <img src={selectedChat.avatar} className="w-20 h-20 rounded-full border object-cover" />
                <h3 className="font-bold text-lg mt-2 font-bold">{selectedChat.name}</h3>
            </div>

            {/* Danh mục */}
            <div className="space-y-2">
                <div className="p-2 border-b">
                    <div className="flex justify-between items-center ">
                        <span className=" font-bold cursor-pointer">Ảnh/Video</span>
                        <span className=" font-bold">{'>'}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 font-bold">
                        Chưa có Ảnh/Video được chia sẻ trong hội thoại này
                    </p>
                </div>
                <div className="p-2 border-b">
                    <div className="flex justify-between items-center ">
                        <span className="font-bold cursor-pointer">File</span>
                        <span className=" font-bold">{'>'}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 font-bold">
                        Chưa có File được chia sẻ trong hội thoại này
                    </p>
                </div>
                <div className="items-center p-2 border-b cursor-pointer">
                    <div className="flex justify-between items-center ">
                        <span className="text-gray-600 font-bold">Link</span>
                        <span className="font-bold">{'>'}</span>
                    </div>

                    <p className="text-xs text-gray-400 mt-1 font-bold">
                        Chưa có Link được chia sẻ trong hội thoại này
                    </p>
                </div>
            </div>

            {/* Xóa lịch sử trò chuyện */}
            <div className="mt-4 text-red-500 flex items-center space-x-2 cursor-pointer">
                <FaTrashAlt />
                <span>Xóa lịch sử trò chuyện</span>
            </div>
        </div>
    );
}

export default TabChatInfo;
