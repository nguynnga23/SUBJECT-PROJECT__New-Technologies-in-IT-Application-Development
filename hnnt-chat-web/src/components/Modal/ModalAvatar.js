import { useRef } from 'react';

import { MdOutlineInsertPhoto } from 'react-icons/md';

import { motion } from 'framer-motion';

import { useSelector } from 'react-redux';

function ModalAvatar({ setImage, setIsType }) {
    const userActive = useSelector((state) => state.auth.userActive);
    const Avatar = userActive?.avatar;

    // lấy ảnh từ máy
    const fileInputRef = useRef(null);

    const handleTakePhoto = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <motion.div
            initial={{ x: '100%', opacity: 0 }} // Bắt đầu ngoài màn hình bên phải
            animate={{ x: '0%', opacity: 1 }} // Trượt vào giữa màn hình
            exit={{ x: '100%', opacity: 0 }} // Khi đóng, trượt ngược ra phải
            transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
            <div className="border-t pt-2 flex justify-center">
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const imageUrl = URL.createObjectURL(file); // Tạo URL tạm thời
                            setImage(imageUrl);
                            setIsType('editAvatar');
                        }
                    }}
                />
                <button
                    onClick={handleTakePhoto}
                    className="w-11/12 text-blue-800 bg-blue-200 hover:bg-blue-300 rounded-md flex items-center justify-center gap-2 p-2 cursor-pointer"
                >
                    <MdOutlineInsertPhoto className="cursor-pointer" />
                    <p className="font-semibold">Tải lên từ máy tính</p>
                </button>
            </div>

            <p className="font-semibold ml-4 mt-6">Ảnh đại diện của tôi</p>

            <div className="grid grid-cols-4 gap-4 w-full px-6 mt-3">
                {userActive?.currentAvatar?.map((avatar, index) => (
                    <div className="flex relative group" key={index}>
                        <img
                            src={avatar.url}
                            alt="avatar"
                            className="w-16 h-16 object-cover rounded-full border-1 border-black cursor-pointer"
                            onClick={() => {
                                setIsType('editAvatar');
                                setImage(avatar.url);
                            }}
                        />
                        <button
                            onClick={() => console.log(`xóa ảnh ${avatar.id} khỏi account`)}
                            className="absolute top-0 right-2 w-5 h-5 flex items-center justify-center bg-gray-200 text-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-300"
                        >
                            ⨉
                        </button>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

export default ModalAvatar;
