import { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { getUserByNumberOrEmail, searchByPhone, sendFriendRequest } from '../../screens/Home/api';

const data = [
    'Trần Văn A',
    'Trần Văn B',
    'Trần Văn C',
    'Nguyễn Văn D',
    'Lê Thị E',
    'Phạm Văn F',
    'Hoàng Thị G',
    'Vũ Văn H',
    'Đặng Thị I',
    'Bùi Văn J',
    'Ngô Thị K',
    'Đỗ Văn L',
    'Trịnh Văn M',
    'Hồ Thị N',
    'Tô Văn O',
];

const PopupAddFriend = ({ isOpen, onClose }) => {
    const [visibleCount, setVisibleCount] = useState(5);
    const [searchNumber, setSearchNumber] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        if (searchNumber.trim() === '') {
            alert('Vui lòng nhập số điện thoại');
            return;
        }

        try {
            const data = await getUserByNumberOrEmail(searchNumber);
            if (data) {
                console.log('Kết quả tìm kiếm:', data);
            } else {
                alert('Không tìm thấy người dùng nào');
            }
        } catch (error) {
            console.error('Lỗi khi tìm kiếm', error);
        }
    };

    //debounce tìm kiếm
    useEffect(() => {
        if (searchNumber.length === 0) return;

        const timeout = setTimeout(() => {
            const fetchData = async () => {
                const data = await searchByPhone(searchNumber);
                setResults(data);
            };
            fetchData();
        }, 300);

        return () => clearTimeout(timeout);
    }, [searchNumber]);

    console.log('results', results);

    const handleRequestFriend = async (user) => {
        try {
            await sendFriendRequest(user?.id);
            alert(`Đã gửi lời mời kết bạn đến ${user?.name}`);
        } catch (error) {}
    };

    // Mỗi khi mở popup, reset lại số người hiển thị
    useEffect(() => {
        if (isOpen) {
            setVisibleCount(5);
            setSearchNumber('');
            setResults([]);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#fff] w-96 rounded-lg shadow-lg max-h-[90vh] flex flex-col  dark:bg-gray-900 dark:text-gray-300">
                {/* Header */}
                <div className="flex justify-between items-center p-3 border-b border-gray-400">
                    <h2 className="text-lg font-semibold">Thêm bạn</h2>
                    <button onClick={onClose}>
                        <IoClose className="text-xl hover:text-gray-400" />
                    </button>
                </div>

                {/* Body với Scroll */}
                <div className="p-4 flex-1">
                    {/* Ô nhập số điện thoại */}
                    <div className="flex items-center space-x-2 border-b border-gray-400 pb-2">
                        <span className="text-lg">🇻🇳 (+84)</span>
                        <input
                            type="text"
                            placeholder="Số điện thoại"
                            className="bg-transparent border-none outline-none w-full"
                            value={searchNumber}
                            onChange={(e) => setSearchNumber(e.target.value)}
                        />
                    </div>

                    {/* Gợi ý kết bạn */}
                    <div className="mt-4">
                        <h3 className="text-sm text-gray-400">Có thể bạn quen</h3>
                        <div className="mt-2 max-h-[300px] overflow-y-auto">
                            <ul className="space-y-3">
                                {/* {results.map((user, index) => (
                                    <li key={index} className="flex justify-between items-center">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gray-500 rounded-full">
                                                <img src={user.avatar} alt="avatar" />
                                            </div>
                                            <div>
                                                <p className="text-sm">{user.name}</p>
                                                <p className="text-xs text-gray-400">Từ gợi ý kết bạn</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRequestFriend(user)}
                                            className="text-blue-500 border border-blue-500 px-3 py-1 rounded-lg text-xs"
                                        >
                                            Kết bạn
                                        </button>
                                    </li>
                                ))} */}
                            </ul>
                        </div>
                        {visibleCount < data.length && (
                            <button
                                className="mt-3 text-blue-500 text-sm w-full text-center"
                                onClick={() => setVisibleCount(visibleCount + 10)}
                            >
                                Xem thêm
                            </button>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end p-4 border-t border-gray-200 space-x-3">
                    <button onClick={onClose} className="px-4 py-2 text-white bg-gray-400 rounded-lg">
                        Hủy
                    </button>
                    <button className="px-4 py-2 text-white bg-blue-600 text rounded-lg" onClick={handleSearch}>
                        Tìm kiếm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopupAddFriend;
