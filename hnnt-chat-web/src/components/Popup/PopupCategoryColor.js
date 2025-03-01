import categorieColors from '../../sample_data/listCategoryColor';
import { MdLabel } from 'react-icons/md';

function PopupCategoryColor({ setColor, setShowPopupColor }) {
    const handleColorChoose = (color) => {
        setColor(color);
        setShowPopupColor(false);
    };
    return (
        <div
            className={`flex z-10 justify-between items-center p-4 py-5 absolute border top-[30px] bg-white w-[240px] h-[30px] rounded-lg dark:bg-gray-800`}
            // onMouseLeave={() => setTimeout(() => setShowPopupReaction(false), 500)}
        >
            {categorieColors.map((c, index) => (
                <MdLabel
                    key={index}
                    className={`text-[20px] hover:text-[25px] ${c.color}`}
                    onClick={() => handleColorChoose(c.color)}
                />
            ))}
        </div>
    );
}

export default PopupCategoryColor;
