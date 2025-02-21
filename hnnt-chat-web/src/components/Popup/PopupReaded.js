import { useState, useEffect, useRef } from 'react';
import { MdOutlineMoreHoriz } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { setSeemAllChat } from '../../redux/slices/chatSlice';

function PopupReaded() {
    const [isOpen, setIsOpen] = useState(false);
    const [readed, setReaded] = useState(false);
    const popupRef = useRef(null);
    const dispatch = useDispatch();

    // Hàm đóng popup khi click bên ngoài
    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={popupRef}>
            {/* Nút mở dropdown */}
            <div className="h-full flex items-center">
                <div className="pl-2 cursor-pointer">
                    <MdOutlineMoreHoriz
                        size={24}
                        onClick={() => setIsOpen(!isOpen)}
                        className={`cursor-pointer ${isOpen ? 'text-blue-500' : ''}`}
                    />
                </div>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border">
                    <div
                        onClick={() => {
                            dispatch(setSeemAllChat());
                            setIsOpen(false);
                        }}
                        className="flex items-center my-1 hover:bg-gray-100 rounded-lg cursor-pointer"
                    >
                        <span className="flex-1 my-1 text-sm text-center">Đánh dấu đã đọc</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PopupReaded;
