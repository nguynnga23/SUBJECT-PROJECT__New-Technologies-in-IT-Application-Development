import { IoHeartDislikeOutline } from 'react-icons/io5';
import { addReaction, removeReaction } from '../../redux/slices/chatSlice';
import { useDispatch } from 'react-redux';

function PopupReacttion({ position, setShowPopupReaction, chatId, message, reactions, userId }) {
    const dispatch = useDispatch();
    const hasUserReacted = Boolean(reactions.length > 0 && reactions.some((reaction) => reaction.id === userId));

    const handleReaction = (reaction) => {
        const messageId = message.id;
        dispatch(addReaction({ chatId, messageId, reaction, userId }));

        setShowPopupReaction(false); // Ẩn popup sau khi chọn
    };

    return (
        <div
            className={`flex z-10 justify-between items-center p-4 py-5 absolute ${
                position === 'right' ? 'right-[-5px]' : 'left-[-5px]'
            } bg-white w-[240px] h-[30px] rounded-lg`}
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
            {reactions.length > 0 && hasUserReacted && (
                <button
                    className="text-[20px] hover:text-[25px]"
                    onClick={() => {
                        setShowPopupReaction(false);
                        const messageId = message.id;
                        dispatch(removeReaction({ chatId, messageId, userId }));
                    }}
                >
                    <IoHeartDislikeOutline />
                </button>
            )}
        </div>
    );
}

export default PopupReacttion;
