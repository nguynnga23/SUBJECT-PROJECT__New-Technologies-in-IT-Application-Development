import { useState } from 'react';
import Picker from 'emoji-picker-react';
import GifPicker from 'gif-picker-react';
import { useDispatch, useSelector } from 'react-redux';
import { sendEmoji, sendMessage } from '../../redux/slices/chatSlice';
import listSticker from '../../sample_data/listSticker';

function TabChatSymbol() {
    const activeChat = useSelector((state) => state.chat.activeChat);
    const subTab = useSelector((state) => state.chat.rightBarTabSub);

    const [activeTab, setActiveTab] = useState(subTab);

    const stickers = listSticker;
    const dispatch = useDispatch();

    const onEmojiClick = (emojiData) => {
        dispatch(sendEmoji(emojiData));
    };
    const onGifClick = (gifObject) => {
        const currentTime = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });

        dispatch(sendMessage({ chatId: activeChat.id, content: gifObject.url, time: currentTime, type: 'gif' }));
    };
    const onStickerClick = (sticker) => {
        const currentTime = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
        dispatch(sendMessage({ chatId: activeChat.id, content: sticker, time: currentTime, type: 'sticker' }));
    };

    return (
        <>
            {/* Tabs */}
            <div className="flex border-b dark:border-black h-[50px] text-sm justify-between items-center  dark:text-gray-300 ">
                {['sticker', 'emoji', 'gif'].map((tab) => (
                    <button
                        key={tab}
                        className={`w-[100%] h-[100%] hover:text-blue-500 font-semibold ${
                            activeTab === tab ? 'text-blue-500 border-b border-blue-500' : ''
                        }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="h-[400px]">
                <div className=" grid gap-2 w-full max-h-[500px]">
                    {activeTab === 'sticker' && (
                        <div className="flex flex-wrap p-1 gap-2">
                            {stickers.map((src, index) => (
                                <img
                                    key={index}
                                    src={src.sticker}
                                    alt="sticker"
                                    className="w-20 h-20 cursor-pointer p-1"
                                    onClick={() => onStickerClick(src.sticker)}
                                />
                            ))}
                        </div>
                    )}

                    {activeTab === 'emoji' && (
                        <div className="flex h-[calc(100vh-112px)] ">
                            <Picker
                                onEmojiClick={onEmojiClick}
                                height={'100%'}
                                width={'100%'}
                                className="dark:bg-gray-900 dark:border-black"
                            />
                        </div>
                    )}

                    {activeTab === 'gif' && (
                        <div className="flex h-[calc(100vh-112px)] ">
                            <GifPicker
                                tenorApiKey={process.env.REACT_APP_TENNORAPIKEY}
                                onGifClick={onGifClick}
                                height={'100%'}
                                width={'100%'}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default TabChatSymbol;
