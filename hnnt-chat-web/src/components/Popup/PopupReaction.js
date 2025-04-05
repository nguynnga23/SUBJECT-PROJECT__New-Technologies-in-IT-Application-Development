import { IoHeartDislikeOutline } from 'react-icons/io5';
import { reactionMessage, removeReactionMessage } from '../../screens/Messaging/api';

function PopupReacttion({ position, setShowPopupReaction, message, reactions, userId }) {
    const hasUserReacted = Boolean(reactions.length > 0 && reactions.some((reaction) => reaction.user.id === userId));

    const handleReaction = (reaction) => {
        const messageId = message.id;
        reactionMessage(messageId, userId, reaction);

        setShowPopupReaction(false); // Ẩn popup sau khi chọn
    };

    return (
        <div
            className={`flex z-10 justify-between items-center p-4 py-5 absolute ${
                position === 'right' ? 'right-[-5px]' : 'left-[-5px]'
            } bottom-[2px] bg-white w-[240px] h-[30px] rounded-lg`}
            onMouseLeave={() => setShowPopupReaction(false)}
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
                        removeReactionMessage(messageId, userId);
                    }}
                >
                    <IoHeartDislikeOutline />
                </button>
            )}
        </div>
    );
}

export default PopupReacttion;
