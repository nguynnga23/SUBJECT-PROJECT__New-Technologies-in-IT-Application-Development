function ModalEditAvatar({ image, setIsType, onClose }) {
    return (
        <>
            <div className="flex-1 overflow-auto pt-6 border-t border-gray-200 relative">
                <div className="w-full flex justify-center relative">
                    {/* Ảnh hiển thị */}
                    <img src={image} alt="Preview" className="mt-2 max-w-full h-80 object-cover " />

                    {/* Lớp mờ với vùng tròn trong suốt */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        style={{
                            WebkitMaskImage: `radial-gradient(circle 160px at center, transparent 160px, black 161px)`,
                            maskImage: `radial-gradient(circle 160px at center, transparent 160px, black 161px)`,
                        }}
                    />
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
