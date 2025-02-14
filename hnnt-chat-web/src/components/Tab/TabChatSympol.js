import { useState } from 'react';
import Picker from 'emoji-picker-react';
import GifPicker from 'gif-picker-react';
import { useDispatch } from 'react-redux';
import { sendEmoji, sendGif, sendSticker } from '../../redux/slices/chatSlice';
import listSticker from '../../sample_data/listSticker';

function TabChatSymbol() {
    const [activeTab, setActiveTab] = useState('emoji');

    const stickers = listSticker;
    const dispatch = useDispatch();

    const onEmojiClick = (emojiData) => {
        dispatch(sendEmoji(emojiData));
    };
    const onGifClick = (gifObject) => {
        console.log(gifObject);

        dispatch(sendGif(gifObject));
    };
    const onStickerClick = (sticker) => {
        dispatch(sendSticker(sticker));
    };

    return (
        <>
            {/* Tabs */}
            <div className="flex border-b  h-[50px] text-sm justify-between items-center">
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
                        <div className="flex h-[calc(100vh-112px)]">
                            <Picker onEmojiClick={onEmojiClick} height={'100%'} width={'100%'} />
                        </div>
                    )}

                    {activeTab === 'gif' && (
                        <div className="flex h-[calc(100vh-112px)]">
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
