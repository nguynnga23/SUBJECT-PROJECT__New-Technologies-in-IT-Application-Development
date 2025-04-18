import { IoHeartDislikeOutline } from 'react-icons/io5';
import { reactionMessage, removeReactionMessage } from '../../screens/Messaging/api';
import { socket } from '../../configs/socket';
import { useSelector } from 'react-redux';

function PopupReacttion({ position, setShowPopupReaction, message, reactions, userId }) {
    const hasUserReacted = Boolean(reactions.length > 0 && reactions.some((reaction) => reaction.user.id === userId));
    const activeChat = useSelector((state) => state.chat.activeChat);

    const handleReaction = async (reaction) => {
        const messageId = message.id;
        const reactionMess = await reactionMessage(messageId, userId, reaction);
        if (reactionMess) {
            socket.emit('reaction_message', {
                chatId: activeChat.id,
            });
        }
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
                        socket.emit('reaction_message', {
                            chatId: activeChat.id,
                    });
                    }}
                >
                    <IoHeartDislikeOutline />
                </button>
            )}
        </div>
    );
}

export default PopupReacttion;
