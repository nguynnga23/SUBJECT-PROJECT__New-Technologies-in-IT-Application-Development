import { useState } from 'react';

function TabSettingAuthen() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-[14px] font-semibold">Đổi mật khẩu</h2>
            <p className="text-[11px] text-gray-500 mb-4">
                <strong>Lưu ý:</strong> Mật khẩu bao gồm chữ kèm theo số hoặc ký tự đặc biệt, tối thiểu 8 ký tự trở lên
                & tối đa 32 ký tự.
            </p>

            <div className="bg-white p-6 rounded-lg">
                <div className="mb-4">
                    <label className="block text-gray-700">Mật khẩu hiện tại</label>
                    <div className="flex border rounded-lg overflow-hidden">
                        <input
                            type={showCurrent ? 'text' : 'password'}
                            className="w-full px-3 py-2 focus:outline-none"
                            placeholder="Nhập mật khẩu hiện tại"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <button className="px-3 bg-gray-200 text-gray-700" onClick={() => setShowCurrent(!showCurrent)}>
                            {showCurrent ? 'Ẩn' : 'Hiện'}
                        </button>
                    </div>
                </div>

                {/* Mật khẩu mới */}
                <div className="mb-4">
                    <label className="block text-gray-700">Mật khẩu mới</label>
                    <div className="flex border rounded-lg overflow-hidden">
                        <input
                            type={showNew ? 'text' : 'password'}
                            className="w-full px-3 py-2 focus:outline-none"
                            placeholder="Nhập mật khẩu mới"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button className="px-3 bg-gray-200 text-gray-700" onClick={() => setShowNew(!showNew)}>
                            {showNew ? 'Ẩn' : 'Hiện'}
                        </button>
                    </div>
                </div>

                {/* Nhập lại mật khẩu mới */}
                <div className="mb-4">
                    <label className="block text-gray-700">Nhập lại mật khẩu mới</label>
                    <div className="flex border rounded-lg overflow-hidden">
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            className="w-full px-3 py-2 focus:outline-none"
                            placeholder="Nhập lại mật khẩu mới"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button className="px-3 bg-gray-200 text-gray-700" onClick={() => setShowConfirm(!showConfirm)}>
                            {showConfirm ? 'Ẩn' : 'Hiện'}
                        </button>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2">
                    <button className="px-4 py-2 bg-gray-300 rounded-lg">Hủy</button>
                    <button
                        className={`px-4 py-2 rounded-lg ${
                            newPassword && confirmPassword ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'
                        }`}
                        disabled={!newPassword || !confirmPassword}
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
