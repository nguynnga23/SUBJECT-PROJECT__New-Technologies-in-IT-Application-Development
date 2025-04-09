import { useState } from 'react';
import { changePasswordWithToken } from '../../screens/Authentication/api';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/authSlice';

function TabSettingAuthen() {
    const [currentPassWord, setCurrentPassWord] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const dispatch = useDispatch();

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{6,}$/; // Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ cái, số và ký tự đặc biệt
    const handleUpdatePassword = async () => {
        if (!currentPassWord || !newPassword || !confirmPassword) {
            alert('Vui lòng nhập đầy đủ thông tin.');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('Mật khẩu xác nhận không khớp.');
            return;
        }

        if (!passwordRegex.test(newPassword)) {
            alert('Mật khẩu mới phải có ít nhất 6 ký tự, gồm chữ, số và ký tự đặc biệt.');
            return;
        }

        try {
            const data = await changePasswordWithToken(currentPassWord, newPassword);

            // const token = localStorage.getItem('token');
            // dispatch(setUser({ userActive: data.user, token: data.token }));

            alert('Đổi mật khẩu thành công!');
            setCurrentPassWord('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu');
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-[14px] font-semibold">Đổi mật khẩu</h2>
            <p className="text-[11px] text-gray-500 mb-4">
                <strong>Lưu ý:</strong> Mật khẩu bao gồm chữ kèm theo số hoặc ký tự đặc biệt, tối thiểu 8 ký tự trở lên
                & tối đa 32 ký tự.
            </p>

            <div className="bg-white p-6 rounded-lg dark:bg-gray-800 dark:text-gray-300">
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">Mật khẩu hiện tại</label>
                    <div className="flex border rounded-lg overflow-hidden">
                        <input
                            type={showCurrent ? 'text' : 'password'}
                            className="w-full px-3 py-2 focus:outline-none dark:bg-gray-800 dark:text-gray-300"
                            placeholder="Nhập mật khẩu hiện tại"
                            value={currentPassWord}
                            onChange={(e) => setCurrentPassWord(e.target.value)}
                        />
                        <button
                            className="px-3 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                            onClick={() => setShowCurrent(!showCurrent)}
                        >
                            {showCurrent ? 'Ẩn' : 'Hiện'}
                        </button>
                    </div>
                </div>

                {/* Mật khẩu mới */}
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">Mật khẩu mới</label>
                    <div className="flex border rounded-lg overflow-hidden">
                        <input
                            type={showNew ? 'text' : 'password'}
                            className="w-full px-3 py-2 focus:outline-none dark:bg-gray-800 dark:text-gray-300"
                            placeholder="Nhập mật khẩu mới"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                            className="px-3 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                            onClick={() => setShowNew(!showNew)}
                        >
                            {showNew ? 'Ẩn' : 'Hiện'}
                        </button>
                    </div>
                </div>

                {/* Nhập lại mật khẩu mới */}
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">Nhập lại mật khẩu mới</label>
                    <div className="flex border rounded-lg overflow-hidden">
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            className="w-full px-3 py-2 focus:outline-none dark:bg-gray-800 dark:text-gray-300"
                            placeholder="Nhập lại mật khẩu mới"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                            className="px-3 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                            onClick={() => setShowConfirm(!showConfirm)}
                        >
                            {showConfirm ? 'Ẩn' : 'Hiện'}
                        </button>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2">
                    <button className="px-4 py-2 bg-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-300">
                        Hủy
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg dark:bg-gray-700 dark:text-gray-300 ${
                            newPassword && confirmPassword ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'
                        }`}
                        disabled={!newPassword || !confirmPassword}
                        onClick={() => handleUpdatePassword()}
                    >
                        Cập nhật
                    </button>
                </div>
            </div>
            {/* Mật khẩu hiện tại */}
        </div>
    );
}

export default TabSettingAuthen;
