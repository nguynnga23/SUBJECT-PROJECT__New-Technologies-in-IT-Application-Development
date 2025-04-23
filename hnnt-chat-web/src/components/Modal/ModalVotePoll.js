import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setShowModalVotePoll } from '../../redux/slices/modalSlice';
import { getUserById } from '../../screens/Profile/api';
import { updateVotePoll, votePollOption } from '../../screens/Polls/api';

export function ModalVotePoll() {
    const valueModalVotePoll = useSelector((state) => state.modal.valueModalVotePoll);
    const userActive = useSelector((state) => state.auth.userActive);

    const [options, setOptions] = useState(valueModalVotePoll?.options || []);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newOption, setNewOption] = useState('');
    const [user, setUser] = useState(null);

    const dispatch = useDispatch();

    const handleSelect = (id) => {
        setSelectedOptions((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    };

    const handleAddOption = () => {
        if (newOption.trim()) {
            setOptions([...options, newOption.trim()]);
            setNewOption('');
            setIsAdding(false);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getUserById(valueModalVotePoll?.creatorId);
                setUser(data);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu người dùng:', error);
            }
        };

        fetchUser();
    });

    useEffect(() => {
        const preSelected = options
            .filter((option) => option.votes?.some((v) => v.voterId === userActive?.id))
            .map((option) => option.id);
        setSelectedOptions(preSelected);
    }, [options, userActive?.id]);

    const handleVote = async () => {
        try {
            if (selectedOptions.length === 0) return;
            // selectedOptions.forEach(async (optionId) => {
            //     await votePollOption(optionId, userActive?.id);
            // });

            await updateVotePoll(valueModalVotePoll?.id, selectedOptions, userActive?.id);

            dispatch(setShowModalVotePoll(false));
        } catch (error) {
            console.error('Lỗi khi bình chọn:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="w-[500px] bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-2">Bình chọn</h2>
                <p className="font-bold">{valueModalVotePoll?.title}</p>
                <p className="text-sm text-gray-500 mb-4">Tạo bởi {user?.name} - Hôm nay</p>

                <label className="flex items-center gap-2 text-sm font-medium mb-4">Chọn nhiều phương án</label>

                <div className="mb-4">
                    {options.map((option, index) => (
                        <div
                            key={index}
                            onClick={() => handleSelect(option?.id)}
                            className={`flex items-center gap-2 mb-3 cursor-pointer rounded-lg px-3 py-1.5 ${
                                selectedOptions.includes(option?.id) ? 'bg-sky-100' : ''
                            }`}
                        >
                            <input type="checkbox" checked={selectedOptions.includes(option?.id)} readOnly />
                            <div className="flex-1">{option?.text}</div>
                            <span className="text-sm text-gray-500">{option?._count?.votes}</span>
                        </div>
                    ))}

                    {isAdding && (
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={newOption}
                                onChange={(e) => setNewOption(e.target.value)}
                                placeholder="Nhập phương án mới"
                                className="flex-1 px-2 py-1.5 rounded-lg border border-gray-300"
                            />
                            <button
                                onClick={handleAddOption}
                                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white border-none"
                            >
                                Thêm
                            </button>
                        </div>
                    )}
                </div>

                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="text-blue-600 text-sm font-medium flex items-center gap-1 mb-6 bg-none border-none cursor-pointer"
                    >
                        + Thêm lựa chọn
                    </button>
                )}

                <div className="flex justify-between items-center">
                    <div className="text-xl text-gray-500 cursor-pointer">⚙️</div>
                    <div className="flex gap-2">
                        <button
                            className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white"
                            onClick={() => dispatch(setShowModalVotePoll(false))}
                        >
                            Hủy
                        </button>
                        <button
                            className="px-3 py-1.5 rounded-lg text-white border-none bg-blue-600"
                            onClick={handleVote}
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
