import { useRef, useState } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import '../../index.css';

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
        .toString()
        .padStart(2, '0');
    const secs = Math.floor(seconds % 60)
        .toString()
        .padStart(2, '0');
    return `${mins}:${secs}`;
}

function ChatAudio({ userId, message, showName }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
    };

    return (
        <div
            className={`relative pb-2 p-3 border rounded-xl w-fit max-w-[300px] flex items-center space-x-3 ${
                message.sender.id === userId
                    ? 'bg-blue-100 dark:bg-[#20344c] border-blue-200 dark:border-blue-100'
                    : 'bg-white dark:bg-[#20344c] border-gray-200 dark:border-gray-800'
            }`}
        >
            {showName && (
                <p className="absolute top-[-18px] left-0 text-[10px] text-gray-400">
                    {message?.sender !== userId && message?.name}
                </p>
            )}
            <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center"
            >
                {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
            </button>

            {/* Sóng âm thanh giả lập + thời gian */}
            <div className="flex items-center space-x-2">
                <div className="flex items-end space-x-[2px] h-[20px]">
                    <div className={`w-[3px] bg-blue-500 rounded-sm ${isPlaying ? 'animate-wave1' : 'h-[10%]'}`}></div>
                    <div className={`w-[3px] bg-blue-500 rounded-sm ${isPlaying ? 'animate-wave2' : 'h-[20%]'}`}></div>
                    <div className={`w-[3px] bg-blue-500 rounded-sm ${isPlaying ? 'animate-wave3' : 'h-[15%]'}`}></div>
                    <div className={`w-[3px] bg-blue-500 rounded-sm ${isPlaying ? 'animate-wave4' : 'h-[18%]'}`}></div>
                    <div className={`w-[3px] bg-blue-500 rounded-sm ${isPlaying ? 'animate-wave5' : 'h-[12%]'}`}></div>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{formatTime(currentTime)}</span>
            </div>

            <audio
                ref={audioRef}
                src={message.content}
                type={message.fileType}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                hidden
            />
        </div>
    );
}

export default ChatAudio;
