import { useState } from 'react';
import Picker from 'emoji-picker-react';
import GifPicker from 'gif-picker-react';

function TabChatSymbol() {
    const [activeTab, setActiveTab] = useState('emoji');
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [chosenGif, setChosenGif] = useState(null);

    const stickers = ['/stickers/pepe1.png', '/stickers/pepe2.png', '/stickers/raccoon1.png', '/stickers/dog.png'];

    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
    };
    const onGiftClick = (event, gifObject) => {
        setChosenGif(gifObject);
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
                    {activeTab === 'sticker' &&
                        stickers.map((src, index) => (
                            <img key={index} src={src} alt="sticker" className="w-16 h-16 cursor-pointer p-4" />
                        ))}

                    {activeTab === 'emoji' && (
                        <div className="flex h-[calc(100vh-112px)]">
                            <Picker onEmojiClick={onEmojiClick} height={'100%'} width={'100%'} />
                        </div>
                    )}

                    {activeTab === 'gif' && (
                        <div className="flex h-[calc(100vh-112px)]">
                            <GifPicker
                                tenorApiKey={process.env.REACT_APP_TENNORAPIKEY}
                                onGiftClick={onGiftClick}
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
