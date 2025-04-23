import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setShowModalVotePoll } from '../../redux/slices/modalSlice';

export function ModalVotePoll() {
    const valueModalVotePoll = useSelector((state) => state.modal.valueModalVotePoll);

    const [options, setOptions] = useState(valueModalVotePoll?.options || []);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newOption, setNewOption] = useState('');

    console.log('valueModalVotePoll', valueModalVotePoll);

    const dispatch = useDispatch();

    const handleSelect = (index) => {
        setSelectedOptions((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
    };

    const handleAddOption = () => {
        if (newOption.trim()) {
            setOptions([...options, newOption.trim()]);
            setNewOption('');
            setIsAdding(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="w-[500px] bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-2">Bình chọn</h2>
                <p className="font-bold">{valueModalVotePoll?.title}</p>
                <p className="text-sm text-gray-500 mb-4">Tạo bởi Nguyễn Thiên Tú - Hôm nay</p>

                <label className="flex items-center gap-2 text-sm font-medium mb-4">Chọn nhiều phương án</label>

                <div className="mb-4">
                    {options.map((option, index) => (
                        <div
                            key={index}
                            onClick={() => handleSelect(index)}
                            className={`flex items-center gap-2 mb-3 cursor-pointer rounded-lg px-3 py-1.5 ${
                                selectedOptions.includes(index) ? 'bg-sky-100' : ''
                            }`}
                        >
                            <input type="checkbox" checked={selectedOptions.includes(index)} readOnly />
                            <div className="flex-1">{option?.text}</div>
                            <span className="text-sm text-gray-500">0</span>
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
                            disabled={selectedOptions.length === 0}
                            className={`px-3 py-1.5 rounded-lg text-white border-none ${
                                selectedOptions.length === 0 ? 'bg-slate-300' : 'bg-blue-600'
                            }`}
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
