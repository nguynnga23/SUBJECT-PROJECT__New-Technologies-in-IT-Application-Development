import { useEffect, useRef } from 'react';
import { CiCircleRemove } from 'react-icons/ci';

function PopupViewImage({ selectedImage, setSelectedImage }) {
    const popupContainerRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupContainerRef.current && !popupContainerRef.current.contains(event.target)) {
                setSelectedImage(null);
            }
        }
        if (selectedImage) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedImage]);

    return (
        <div className="w-full h-full">
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                <div className="relative" ref={popupContainerRef}>
                    <img src={selectedImage} alt="Full View" className="max-w-[90vw] max-h-[90vh]" />
                    <CiCircleRemove
                        className="absolute top-[-25px] right-[-30px] text-white text-3xl cursor-pointer"
                        onClick={() => setSelectedImage(null)}
                    />
                </div>
            </div>
        </div>
    );
}

export default PopupViewImage;
