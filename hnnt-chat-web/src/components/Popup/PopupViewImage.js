import { CiCircleRemove } from 'react-icons/ci';

function PopupViewImage({ selectedImage, setSelectedImage }) {
    return (
        <div className="w-full h-full">
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                <div className="relative">
                    <img src={selectedImage} alt="Full View" className="max-w-[90vw] max-h-[90vh]" />
                    <CiCircleRemove
                        className="absolute top-3 right-3 text-white text-3xl cursor-pointer"
                        onClick={() => setSelectedImage(null)}
                    />
                </div>
            </div>
        </div>
    );
}

export default PopupViewImage;
