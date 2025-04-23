import React, { useState } from 'react';

export function ModalVotePoll() {
    const [options, setOptions] = useState(['Phương án 1', 'Phương án 2']);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newOption, setNewOption] = useState('');

    const handleSelect = (index) => {
        setSelectedOption(index);
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
            <div
                style={{
                    width: 500,
                    background: 'white',
                    borderRadius: 16,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    padding: 24,
                }}
            >
                <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Bình chọn</h2>
                <p style={{ fontWeight: 'bold' }}>nothinwg</p>
                <p style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>Tạo bởi Nguyễn Thiên Tú - Hôm nay</p>

                <label
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 14,
                        fontWeight: 500,
                        marginBottom: 16,
                    }}
                >
                    <input type="checkbox" /> Chọn nhiều phương án
                </label>

                <div style={{ marginBottom: 16 }}>
                    {options.map((option, index) => (
                        <div
                            key={index}
                            onClick={() => handleSelect(index)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                marginBottom: 12,
                                cursor: 'pointer',
                                background: selectedOption === index ? '#e0f2fe' : 'transparent',
                                borderRadius: 8,
                                padding: '6px 12px',
                            }}
                        >
                            <input type="radio" checked={selectedOption === index} readOnly />
                            <div style={{ flex: 1 }}>{option}</div>
                            <span style={{ fontSize: 14, color: '#666' }}>0</span>
                        </div>
                    ))}

                    {isAdding && (
                        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                            <input
                                type="text"
                                value={newOption}
                                onChange={(e) => setNewOption(e.target.value)}
                                placeholder="Nhập phương án mới"
                                style={{ flex: 1, padding: 6, borderRadius: 8, border: '1px solid #ccc' }}
                            />
                            <button
                                onClick={handleAddOption}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: 8,
                                    background: '#2563eb',
                                    color: 'white',
                                    border: 'none',
                                }}
                            >
                                Thêm
                            </button>
                        </div>
                    )}
                </div>

                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        style={{
                            color: '#2563eb',
                            fontSize: 14,
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            marginBottom: 24,
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        + Thêm lựa chọn
                    </button>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 20, color: '#666', cursor: 'pointer' }}>⚙️</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button
                            style={{
                                padding: '6px 12px',
                                borderRadius: 8,
                                border: '1px solid #ccc',
                                background: 'white',
                            }}
                        >
                            Hủy
                        </button>
                        <button
                            disabled
                            style={{
                                padding: '6px 12px',
                                borderRadius: 8,
                                background: '#cbd5e1',
                                color: 'white',
                                border: 'none',
                            }}
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
