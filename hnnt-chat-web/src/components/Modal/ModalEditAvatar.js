import { useState, useEffect } from 'react';

function ModalEditAvatar({ image, setIsType, onClose }) {
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [start, setStart] = useState({ x: 0, y: 0 });

    // Khi nhấn giữ chuột để kéo ảnh
    const handleMouseDown = (e) => {
        setDragging(true);
        setStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    // Khi di chuyển chuột, cập nhật vị trí nếu đang kéo
    const handleMouseMove = (e) => {
        if (!dragging) return;
        setPosition({
            x: e.clientX - start.x,
            y: e.clientY - start.y,
        });
    };

    // Khi thả chuột, dừng kéo
    const handleMouseUp = () => {
        setDragging(false);
    };

    // Gắn sự kiện vào window để xử lý việc nhả chuột khi kéo ra ngoài
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging]);

    return (
        <>
            <div className="flex-1 overflow-hidden pt-6 border-t border-gray-200 relative">
                <div className="w-full flex justify-center relative overflow-hidden">
                    {/* Ảnh hiển thị */}
                    <img
                        src={image}
                        alt="Preview"
                        className="mt-2 max-w-full h-80 object-cover cursor-move active:cursor-move"
                        style={{
                            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                        }}
                        onMouseDown={handleMouseDown}
                    />

                    {/* Lớp mờ với vùng tròn trong suốt */}
                    <div
                        className="absolute inset-0 bg-black/50 pointer-events-none"
                        style={{
                            WebkitMaskImage: `radial-gradient(circle 160px at center, transparent 160px, black 161px)`,
                            maskImage: `radial-gradient(circle 160px at center, transparent 160px, black 161px)`,
                        }}
                    />
                </div>

                {/* Thanh trượt Zoom */}
                <div className="flex items-center my-10 w-80 mx-auto">
                    <button className="text-xl px-2" onClick={() => setZoom((prev) => Math.max(1, prev - 0.1))}>
                        −
                    </button>
                    <input
                        type="range"
                        min="1"
                        max="2"
                        step="0.1"
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="w-full accent-gray-600 active:cursor-grabbing cursor-grab"
                    />
                    <button className="text-xl px-2" onClick={() => setZoom((prev) => Math.min(2, prev + 0.1))}>
                        +
                    </button>
                </div>
            </div>

            {/* button cập nhật */}
            <div className="border-t pt-2 flex justify-end mt-auto">
                <button
                    onClick={() => setIsType('avatar')}
                    className="bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center gap-2 p-2 cursor-pointer mr-2"
                >
                    <p className="font-semibold">Hủy</p>
                </button>

                <button
                    onClick={onClose}
                    className="bg-blue-600 hover:bg-blue-800 rounded-md flex items-center justify-center gap-2 p-2 cursor-pointer mr-3"
                >
                    <p className="font-semibold text-white">Cập nhật</p>
                </button>
            </div>
        </>
    );
}

export default ModalEditAvatar;
