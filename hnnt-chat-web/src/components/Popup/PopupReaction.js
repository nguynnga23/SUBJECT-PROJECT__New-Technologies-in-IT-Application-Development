import { IoHeartDislikeOutline } from 'react-icons/io5';

function PopupReacttion({ position, setShowPopupReaction, reaction, setReaction }) {
    const handleReaction = (reaction) => {
        setReaction((preReactions) => [...preReactions, reaction]); // Truyền emoji vào state
        setShowPopupReaction(false); // Ẩn popup sau khi chọn
    };

    return (
        <div
            className={`flex z-10 justify-between items-center p-4 py-5 absolute ${
                position === 'right' ? 'right-[0]' : 'left-[0]'
            } bottom-[-10px] bg-white w-[240px] h-[30px] rounded-lg`}
            onMouseLeave={() => setTimeout(() => setShowPopupReaction(false), 500)}
        >
            <button className="text-[20px] hover:text-[25px]" onClick={() => handleReaction('👍')}>
                👍
            </button>
            <button className="text-[20px] hover:text-[25px]" onClick={() => handleReaction('❤️')}>
                ❤️
            </button>
            <button className="text-[20px] hover:text-[25px]" onClick={() => handleReaction('🤣')}>
                🤣
            </button>
            <button className="text-[20px] hover:text-[25px]" onClick={() => handleReaction('😮')}>
                😮
            </button>
            <button className="text-[20px] hover:text-[25px]" onClick={() => handleReaction('😭')}>
                😭
            </button>
            <button className="text-[20px] hover:text-[25px]" onClick={() => handleReaction('😡')}>
                😡
            </button>
            {reaction.length > 0 && (
                <button
                    className="text-[20px] hover:text-[25px]"
                    onClick={() => {
                        setReaction([]);
                        setShowPopupReaction(false);
                    }}
                >
                    <IoHeartDislikeOutline />
                </button>
            )}
        </div>
    );
}

export default PopupReacttion;
