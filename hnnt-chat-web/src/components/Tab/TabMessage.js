import { useState, useRef, useEffect } from 'react';
import { IoMdSend } from 'react-icons/io';
import { MdLabelOutline } from 'react-icons/md';
import { VscLayoutSidebarRightOff } from 'react-icons/vsc';
import { VscLayoutSidebarRight } from 'react-icons/vsc';
import { BsTelephone } from 'react-icons/bs';
import { GoDeviceCameraVideo } from 'react-icons/go';
import { IoSearchOutline } from 'react-icons/io5';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { IoImageOutline } from 'react-icons/io5';
import { MdAttachFile } from 'react-icons/md';
import { FaRegAddressCard } from 'react-icons/fa6';
import { MdOutlineEmojiEmotions } from 'react-icons/md';
import { LuSticker } from 'react-icons/lu';
import { MdLabel } from 'react-icons/md';
import { CiUser } from 'react-icons/ci';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { MdOutlineReply } from 'react-icons/md';
import { CiCircleRemove } from 'react-icons/ci';
import { MdFilePresent } from 'react-icons/md';
import { VscFilePdf } from 'react-icons/vsc';
import { FaRegFileWord } from 'react-icons/fa';
import { FaRegFileExcel } from 'react-icons/fa';
import { FaRegFilePowerpoint } from 'react-icons/fa';
import { BsChatText } from 'react-icons/bs';
import { RiKey2Line } from 'react-icons/ri';
import { CiMicrophoneOn } from 'react-icons/ci';

import PopupCategory from '../Popup/PopupCategory';

import { useDispatch, useSelector } from 'react-redux';
import {
    setShowOrOffRightBar,
    setShowOrOffRightBarSearch,
    openEmojiTab,
    sendEmoji,
    setReadedChatWhenSendNewMessage,
    setActiveChat,
} from '../../redux/slices/chatSlice';
import ChatText from '../Chat/ChatText';
import ChatGif from '../Chat/ChatGif';
import ChatImage from '../Chat/ChatImage';
import ChatFile from '../Chat/ChatFile';
import ChatDestroy from '../Chat/ChatDestroy';
import ChatSticker from '../Chat/ChatSticker';
import PopupAddGroup from '../Popup/PopupAddGroup';
import { FiMoreHorizontal } from 'react-icons/fi';
import PopupReacttion from '../Popup/PopupReaction';
import PopupReactionChat from '../Popup/PopupReactionChat';
import PopupMenuForChat from '../Popup/PopupMenuForChat';
import ChatAudio from '../Chat/ChatAudio';
import ChatImageGroup from '../Chat/ChatImageGroup';
import {
    deletePinOfMessage,
    getMessage,
    readedChatOfUser,
    sendMessage,
    uploadFileToS3,
} from '../../screens/Messaging/api';
import PopupAllPinnedOfMessage from '../Popup/PopupAllPinnedOfMessage';

import { socket } from '../../configs/socket';
import { getUserById } from '../../screens/Profile/api';

import { createMeeting } from '../../configs/createMeeting';
import { MeetingProvider } from '@videosdk.live/react-sdk';
import MeetingView from '../../components/Views/MeetingView';
import ChatPollCard from '../Chat/ChatPollCard';

function TabMessage({ setShowModalShareMes, setMessageShare }) {
    const [message, setMessage] = useState('');
    const [isOpenCategory, setIsOpenCategory] = useState(false);
    const userActive = useSelector((state) => state.auth.userActive);
    const userId = userActive?.id;

    const activeChat = useSelector((state) => state.chat.activeChat);

    const chatId = activeChat?.id;

    const dispatch = useDispatch();
    const showRightBar = useSelector((state) => state.chat.showRightBar);
    const showRightBarSearch = useSelector((state) => state.chat.showRightBarSearch);
    const emojiObject = useSelector((state) => state.chat.emojiObject);
    const textareaRef = useRef(null);
    const inputImageRef = useRef(null); // Tạo tham chiếu đến input image
    const inputFileRef = useRef(null); // Tạo tham chiếu đến input image
    const chatContainerRef = useRef(null);
    const [hoveredMessage, setHoveredMessage] = useState(null);
    const [isPopupOpenIndex, setIsPopupOpenIndex] = useState(null);

    const [addGroupButton, setAddGroupButton] = useState(false);

    const [videoCall, setVideoCall] = useState(false);
    const [showPopupReaction, setShowPopupReaction] = useState(false);
    const [openReactionChat, setOpenReactionChat] = useState(false);

    const [replyMessage, setReplyMessage] = useState(null);
    const [showAllPinned, setShowAllPinned] = useState(false);

    const [data, setData] = useState([]);
    const leader = activeChat?.participants?.find((user) => user.role === 'LEADER')?.account;

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const chats = await getMessage(chatId);
                setData(chats);
            } catch (err) {
                console.log(err.message);
            }
        };

        fetchMessages();
    }, [chatId, data]);

    useEffect(() => {
        // Lắng nghe tin nhắn đến từ server
        const handleReceiveMessage = ({ chatId: receivedChatId, newMessage }) => {
            if (activeChat?.id !== receivedChatId) {
                return;
            }
            setData((prev) => [...prev, newMessage]);
            setTimeout(() => {
                if (chatContainerRef.current) {
                    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                }
            }, 100);
        };

        socket.on('receive_message', handleReceiveMessage);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [activeChat?.id]);

    const MessageComponent = {
        text: ChatText,
        gif: ChatGif,
        image: ChatImage,
        file: ChatFile,
        sticker: ChatSticker,
        audio: ChatAudio,
        imageGroup: ChatImageGroup,
        poll: ChatPollCard,
    };

    const getFileIcon = (fileType) => {
        if (fileType.includes('pdf')) return <VscFilePdf className="text-3xl text-red-500 mr-2" />;
        if (fileType.includes('excel') || fileType.includes('spreadsheet') || fileType.includes('xls'))
            return <FaRegFileExcel className="text-3xl text-green-600 mr-2" />;
        if (fileType.includes('powerpoint') || fileType.includes('presentation') || fileType.includes('ppt'))
            return <FaRegFilePowerpoint className="text-3xl text-orange-500 mr-2" />;
        if (fileType.includes('word') || fileType.includes('msword') || fileType.includes('document'))
            return <FaRegFileWord className="text-3xl text-blue-600 mr-2" />;
        return <MdFilePresent className="text-3xl text-gray-500 mr-2" />; // Mặc định
    };

    // Hàm tự động điều chỉnh chiều cao
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = '30px'; // Reset chiều cao trước khi tính toán
            const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
            textareaRef.current.style.height = `${newHeight}px`;
        }
    }, [message]);

    const handleSendMessage = async () => {
        if (message.trim() !== '') {
            try {
                const sendMess = await sendMessage(chatId, message, 'text', replyMessage?.id, null, null, null);
                if (!sendMess) return;

                await readedChatOfUser(chatId);
                dispatch(setReadedChatWhenSendNewMessage({ chatId: chatId, userId: userId }));
                setMessage('');
                setReplyMessage(null);
                socket.emit('send_message', {
                    chatId: activeChat.id,
                    newMessage: sendMess,
                });
            } catch (error) {
                dispatch(setActiveChat(null));
            }
        }
        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, 100);
    };

    useEffect(() => {
        if (emojiObject != null) {
            setMessage((prev) => prev + emojiObject.emoji);
        }
        dispatch(sendEmoji(null));
    }, [emojiObject, dispatch]);

    const handleFileChange = async (event, type) => {
        const file = event.target.files[0];
        if (!file) return;

        let fileUpload = null;
        try {
            fileUpload = await uploadFileToS3(file);
        } catch (error) {
            console.error(error);
        }
        if (fileUpload?.fileUrl) {
            const sendFile = await sendMessage(
                chatId,
                fileUpload?.fileUrl,
                type,
                null,
                file.name,
                file.type,
                (file.size / 1024).toFixed(2) + ' KB',
            );
            socket.emit('send_message', {
                chatId: activeChat.id,
                newMessage: sendFile,
            });
        }
        event.target.value = '';
        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, 100);
    };

    const scrollToMessage = (messageId) => {
        setTimeout(() => {
            const messageElement = document.getElementById(`message-${messageId}`);
            if (messageElement) {
                messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Thêm hiệu ứng phát sáng
                messageElement.classList.add('highlight');

                // Xóa hiệu ứng sau 1.5 giây
                messageElement.classList.add('bg-blue-200');
                messageElement.classList.add('rounded-[5px]');

                // Xóa class sau 1.5 giây
                setTimeout(() => {
                    messageElement.classList.remove('bg-blue-200');
                    messageElement.classList.remove('rounded-[5px]');
                }, 1500);
            } else {
                console.log('Không tìm thấy phần tử:', `message-${messageId}`);
            }
        }, 100); // Đợi 100ms để đảm bảo phần tử đã được render
    };
    const pinnedMessages = data.filter((message) => message.pin);
    const lastPinnedMessage = pinnedMessages[pinnedMessages.length - 1];

    // Hàm video call
    const [meetingId, setMeetingId] = useState(null);
    const [fromId, setFromId] = useState('');
    const [dataUserFrom, setDataUserFrom] = useState('');
    useEffect(() => {
        socket.on('incoming_call', async ({ from, meetingId }) => {
            alert(`📞 Có cuộc gọi đến từ ${from}`);
            setMeetingId(meetingId);
            const data = await getUserById(from);
            setDataUserFrom(data);
            setFromId(from);
        });

        console.log('đã vào đây');

        return () => {
            socket.off('incoming_call');
        };
    }, [meetingId]);

    //Getting the meeting id by calling the api we just wrote
    const authToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI5MzE4YWY4NS1hM2E3LTRlMDQtOGE0YS1mZmM0M2JlZjMyYWIiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc0NDc5ODg2MiwiZXhwIjoxNzQ1NDAzNjYyfQ.xwle1rtuF3EH6ypjTGz6asnyLT-vfuwwORKEMqVROjg';
    //This will set Meeting Id to null when meeting is left or ended
    const onMeetingLeave = () => {
        setMeetingId(null);
    };

    const handleVideoCall = async () => {
        const targetUserId = activeChat?.isGroup
            ? activeChat?.avatar
            : activeChat?.participants?.find((user) => user.accountId !== userId)?.account.id;

        const meetingId = await createMeeting();
        setMeetingId(meetingId);

        socket.emit('call_user', { from: userId, to: targetUserId, meetingId: meetingId });
        setVideoCall(true);
    };

    const handleAnswerCall = () => {
        // Xử lý khi người dùng nhận cuộc gọi
        // Mở video call với người gọi
        socket.emit('accept_call', { from: userId, to: fromId, meetingId });

        socket.on('call_accepted', ({ to, meetingId }) => {
            alert(`Cuộc gọi đã được chấp nhận từ ${to}`);
            setMeetingId(meetingId);
        });
        setVideoCall(true); // Tắt popup gọi video
    };

    const handleRejectCall = () => {
        // Xử lý khi người dùng từ chối cuộc gọi
        socket.emit('reject_call', { from: userId, to: fromId });
        setVideoCall(true); // Tắt popup gọi video
    };

    // handle Recorder
    const [isRecording, setIsRecording] = useState(false); // Trạng thái ghi âm
    const [audioBlob, setAudioBlob] = useState(null); // Lưu blob ghi âm
    const [mediaRecorder, setMediaRecorder] = useState(null); // MediaRecorder instance

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks = [];

            recorder.ondataavailable = (event) => {
                chunks.push(event.data);
            };

            recorder.onstop = async () => {
                const blob = new Blob(chunks, { type: 'audio/wav' });
                setAudioBlob(blob);

                try {
                    const fileUpload = await uploadFileToS3(blob);
                    if (fileUpload?.fileUrl) {
                        const sendFile = await sendMessage(
                            chatId,
                            fileUpload.fileUrl,
                            'audio',
                            null,
                            'audio recording',
                            'audio/wav',
                            (blob.size / 1024).toFixed(2) + ' KB',
                        );

                        socket.emit('send_message', {
                            chatId: activeChat.id,
                            newMessage: sendFile,
                        });
                    } else {
                        alert('❌ Tải tệp lên thất bại!');
                    }
                } catch (error) {
                    console.error('Lỗi khi gửi bản ghi âm:', error);
                    alert('❌ Gửi bản ghi âm thất bại!');
                } finally {
                    // Dọn dẹp sau khi gửi
                    setAudioBlob(null);
                    if (recorder.stream) {
                        recorder.stream.getTracks().forEach((track) => track.stop());
                    }
                    setMediaRecorder(null);
                }
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
        } catch (error) {
            console.error('Không thể bắt đầu ghi âm:', error);
            alert('❌ Không thể truy cập micro!');
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    // Nút bật/tắt ghi âm
    const toggleRecording = () => {
        if (isRecording) {
            console.log('⏹️ Dừng ghi âm');
            stopRecording();
        } else {
            console.log('🔴 Bắt đầu ghi âm');
            startRecording();
        }
    };

    // handle change multiple file
    const handleChangeTypeFile = (event, type) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        if (files.length === 1) {
            handleFileChange(event, type);
        } else {
            handleMultipleFiles(event, type);
        }

        event.target.value = '';
    };

    const handleMultipleFiles = async (event, type) => {
        const files = Array.from(event.target.files); // Lấy nhiều file
        if (!files.length) return;

        const uploadedFiles = [];

        for (const file of files) {
            try {
                const fileUpload = await uploadFileToS3(file);
                if (fileUpload?.fileUrl) {
                    uploadedFiles.push({
                        url: fileUpload.fileUrl,
                        fileName: file.name,
                        fileSize: (file.size / 1024).toFixed(2) + ' KB',
                        fileType: file.type,
                    });
                }
            } catch (error) {
                console.error('Upload failed for:', file.name, error);
            }
        }

        if (uploadedFiles.length > 0) {
            // Lưu toàn bộ thông tin file vào content dạng JSON string
            const sendFile = await sendMessage(
                chatId,
                JSON.stringify(uploadedFiles), // Lưu mảng vào content
                (type = 'imageGroup'),
                null,
            );

            socket.emit('send_message', {
                chatId: activeChat.id,
                newMessage: sendFile,
            });
        }

        event.target.value = '';
        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, 100);
    };

    return (
        <>
            <div className="p-2 border-b dark:border-b-black flex justify-between items-center h-[62px] min-w-[600px] dark:bg-gray-800">
                <div className="flex justify-center ">
                    <div className="relative w-[45px] h-[45px] mr-2">
                        <img
                            src={
                                activeChat?.isGroup
                                    ? activeChat?.avatar
                                    : activeChat?.participants?.find((user) => user.accountId !== userId)?.account
                                          .avatar
                            } // Thay bằng avatar thật
                            alt="avatar"
                            className="w-[45px] h-[45px] rounded-full border object-cover"
                        />
                        {activeChat?.participants?.find((user) => user.accountId !== userId)?.account?.status ===
                        'active' ? (
                            <span className="absolute p-[2px] w-[10px] h-[10px] right-[3px] bottom-[0px] rounded-full bg-green-600 border-[2px]"></span>
                        ) : (
                            <span className="absolute p-[2px] w-[10px] h-[10px] right-[3px] bottom-[0px] rounded-full bg-gray-500 border-[2px]"></span>
                        )}
                    </div>
                    <div>
                        <h3 className="font-medium text-base text-lg max-h-[28px] dark:text-gray-300">
                            {activeChat?.isGroup
                                ? activeChat?.name
                                : activeChat?.participants?.find((user) => user.accountId !== userId)?.account?.name ||
                                  'Người dùng'}
                        </h3>
                        <div className="flex items-center">
                            {activeChat?.isGroup && (
                                <div className="flex text-[14px] text-gray-600 items-center dark:text-gray-300">
                                    <CiUser className={`cursor-pointer mr-1`} />
                                    <p className="text-[10px] mr-1">{activeChat?.participants.length} thành viên |</p>
                                </div>
                            )}
                            {activeChat.participants?.find((user) => user.accountId === userId)?.category ? (
                                <div className="flex items-center">
                                    <MdLabel
                                        className={`cursor-pointer mr-1 ${
                                            activeChat.participants?.find((user) => user.accountId === userId)?.category
                                                .color
                                        }`}
                                        onClick={() => setIsOpenCategory(!isOpenCategory)}
                                    />
                                    <p className="text-[10px] dark:text-gray-300">
                                        {
                                            activeChat.participants?.find((user) => user.accountId === userId)?.category
                                                ?.name
                                        }
                                    </p>
                                </div>
                            ) : (
                                <MdLabelOutline
                                    className={`cursor-pointer text-gray-400`}
                                    onClick={() => setIsOpenCategory(!isOpenCategory)}
                                />
                            )}
                        </div>
                    </div>
                    {isOpenCategory && <PopupCategory isOpen={isOpenCategory} setIsOpen={setIsOpenCategory} />}
                </div>
                <div className="p-2 flex dark:text-gray-300">
                    {activeChat?.isGroup ? (
                        <div className="flex items-center">
                            <AiOutlineUsergroupAdd
                                size={26}
                                onClick={() => setAddGroupButton(true)}
                                className="ml-1.5 p-1 hover:text-gray-500 hover:bg-gray-200  hover:rounded-[5px] cursor-pointer"
                            />
                            <PopupAddGroup
                                isOpen={addGroupButton}
                                onClose={() => setAddGroupButton(false)}
                                activeChat={activeChat}
                            />
                        </div>
                    ) : (
                        <BsTelephone
                            size={26}
                            className="ml-1.5 p-1 hover:text-gray-500 hover:bg-gray-200  hover:rounded-[5px] cursor-pointer"
                            onClick={() => setVideoCall(true)}
                        />
                    )}
                    <GoDeviceCameraVideo
                        size={26}
                        className="ml-1.5 p-1 hover:text-gray-500 hover:bg-gray-200  hover:rounded-[5px] cursor-pointer"
                        onClick={handleVideoCall}
                    />
                    <IoSearchOutline
                        size={26}
                        className={`ml-1.5 p-1 hover:text-gray-500 hover:bg-gray-200  hover:rounded-[5px] cursor-pointer ${
                            showRightBarSearch ? 'text-blue-500 bg-blue-200 rounded-[5px]' : ''
                        }`}
                        onClick={() => dispatch(setShowOrOffRightBarSearch(!showRightBarSearch))}
                    />

                    {showRightBar ? (
                        <VscLayoutSidebarRight
                            size={26}
                            className="ml-1.5 text-blue-500 bg-blue-200 p-1 rounded-[5px] cursor-pointer"
                            onClick={() => dispatch(setShowOrOffRightBar(!showRightBar))}
                        />
                    ) : (
                        <VscLayoutSidebarRightOff
                            size={26}
                            className="ml-1.5 p-1 hover:text-gray-500 hover:rounded-[5px] hover:bg-gray-200 cursor-pointer"
                            onClick={() => dispatch(setShowOrOffRightBar(!showRightBar))}
                        />
                    )}

                    {videoCall && (
                        <MeetingProvider
                            config={{
                                meetingId,
                                micEnabled: true,
                                webcamEnabled: true,
                                name: 'C.V. Raman',
                            }}
                            token={authToken}
                        >
                            <MeetingView
                                meetingId={meetingId}
                                onMeetingLeave={onMeetingLeave}
                                setVideoCall={setVideoCall}
                                activeChat={activeChat}
                                userActive={userActive}
                            />
                            {/* <PopupVideoCall
                                setVideoCall={setVideoCall}
                                activeChat={activeChat}
                                userActive={userActive}
                            /> */}
                        </MeetingProvider>
                    )}
                    {fromId !== '' && (
                        <div className="w-full h-full">
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                                <div className="relative">
                                    <div className="relative bg-white w-[50vw] h-[40vh] flex flex-col items-center justify-center rounded-xl shadow-lg p-6 space-y-6">
                                        {/* Avatar */}
                                        <img
                                            src={dataUserFrom?.avatar} // Đổi thành avatar thật nếu có
                                            alt="Avatar"
                                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                                        />

                                        {/* Tên người dùng */}
                                        <h2 className="text-xl font-semibold text-gray-800">{dataUserFrom?.name}</h2>

                                        {/* Các nút điều khiển */}
                                        <div className="flex space-x-6">
                                            <button
                                                onClick={() => {
                                                    handleRejectCall();
                                                    setFromId('');
                                                }}
                                                className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition"
                                            >
                                                Tắt máy
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleAnswerCall();
                                                    setFromId('');
                                                }}
                                                className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition"
                                            >
                                                Bắt máy
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="p-1.5 bg-gray-200 dark:bg-gray-800">
                <div className="relative">
                    {/* Hiển thị tin nhắn ghim cuối cùng */}
                    {lastPinnedMessage && (
                        <div className="p-2 text-[10px] flex dark:bg-gray-700 bg-white rounded-lg shadow items-center justify-between dark:text-gray-300">
                            <div
                                className="flex items-center cursor-pointer"
                                onClick={() => scrollToMessage(lastPinnedMessage.id)}
                            >
                                <BsChatText size={20} className="text-blue-500 m-1" />
                                <div className="ml-1">
                                    <p>Tin nhắn</p>
                                    <div className="flex items-center max-w-[500px] truncate">
                                        <p className="font-medium text-gray-600 dark:text-gray-300 mr-2">
                                            {lastPinnedMessage.sender?.name}:
                                        </p>
                                        {lastPinnedMessage.type === 'file' ? (
                                            <div className="flex items-center">
                                                <MdFilePresent className="text-[10px] text-gray-500 mr-1" />
                                                <div className="flex flex-col">
                                                    <p className="text-[10px] font-bold">
                                                        {lastPinnedMessage.fileName}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : lastPinnedMessage.type === 'image' ? (
                                            <img
                                                src={lastPinnedMessage.content}
                                                alt="content"
                                                className="max-w-[80px] rounded-lg"
                                            />
                                        ) : lastPinnedMessage.type === 'gif' ? (
                                            <img
                                                src={lastPinnedMessage.content}
                                                alt="GIF"
                                                className="max-w-[80px] rounded-lg"
                                            />
                                        ) : lastPinnedMessage.type === 'sticker' ? (
                                            <img
                                                src={lastPinnedMessage.content}
                                                alt="GIF"
                                                className="max-w-[50px] rounded-lg"
                                            />
                                        ) : (
                                            lastPinnedMessage.content
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Nút mở popup */}
                            {pinnedMessages.length > 1 && (
                                <button
                                    onClick={() => setShowAllPinned(!showAllPinned)}
                                    className="ml-2 text[10px] p-1 border border-gray-600 rounded-[3px] bg-white mr-3 dark:bg-gray-600"
                                >
                                    + ({pinnedMessages.length}) ghim
                                </button>
                            )}
                            {pinnedMessages.length === 1 && (
                                <p
                                    className="absolute text-red-500 text-[7px] right-[5px] top-[10px] p-1 cursor-pointer hover:bg-red-500 hover:text-white border rounded-lg"
                                    onClick={() => {
                                        deletePinOfMessage(pinnedMessages[0].id);
                                        socket.emit('reaction_message', {
                                            chatId: activeChat.id,
                                        });
                                    }}
                                >
                                    Bỏ ghim
                                </p>
                            )}
                        </div>
                    )}

                    {/* Popup hiển thị tất cả tin nhắn ghim */}
                    {showAllPinned && (
                        <PopupAllPinnedOfMessage
                            pinnedMessages={pinnedMessages}
                            showAllPinned={showAllPinned}
                            setShowAllPinned={setShowAllPinned}
                            scrollToMessage={scrollToMessage}
                        />
                    )}
                </div>
            </div>
            <div className="flex-1 p-4 overflow-auto bg-gray-200 dark:bg-[#16191d] " ref={chatContainerRef}>
                {data.map((message, index) => {
                    const isDeleted = message.deletedBy.some((item) => item === userId);
                    const Component = message.destroy ? ChatDestroy : MessageComponent[message.type];
                    // Kiểm tra nếu tin nhắn trước đó bị xóa hoặc có sender khác
                    const prevMessage = data[index - 1];
                    const prevMessageDeleted = prevMessage?.deletedBy?.some((item) => item === userId);
                    const showAvatar =
                        index === 0 ||
                        // !prevMessage ||
                        prevMessage.sender.id !== message.sender.id ||
                        prevMessageDeleted;
                    const position = message.sender.id === userId ? 'right' : 'left';
                    const sumReaction = message.reactions.reduce((total, reaction) => total + reaction.sum, 0);

                    // Xác định tin nhắn cuối cùng của userId
                    const lastMessage = data[data.length - 1];

                    if (message.type === 'notify') {
                        return (
                            <div className="relative flex items-center mb-2 text-[8px] text-gray-500 justify-center ">
                                <p className="bg-gray-300 rounded-lg p-1 px-2 font-bold">{message.content}</p>
                            </div>
                        );
                    } else {
                        return (
                            <div
                                id={`message-${message.id}`}
                                className={`relative ${
                                    message.type === 'poll'
                                        ? 'flex justify-center mb-2'
                                        : `flex items-center mb-2 ${
                                              message.sender.id === userId ? 'justify-end' : 'justify-start'
                                          }`
                                }`}
                                key={index}
                                onMouseEnter={() => {
                                    if (isPopupOpenIndex === null) setHoveredMessage(index);
                                    setOpenReactionChat(false);
                                }}
                                onMouseLeave={() => {
                                    if (isPopupOpenIndex === null) setHoveredMessage(null);
                                    setOpenReactionChat(false);
                                }}
                            >
                                {!isDeleted && Component && (
                                    <div className="flex items-center">
                                        <div className=" mr-3 w-[45px] h-[45px] ">
                                            {message.sender.id !== userId && showAvatar && (
                                                <div className="relative w-[45px] h-[45px] flex-shrink-0">
                                                    <img
                                                        src={message.sender.avatar}
                                                        alt="avatar"
                                                        className="w-full h-full rounded-full border object-cover"
                                                    />
                                                    {leader?.id === message.sender.id && (
                                                        <RiKey2Line
                                                            size={15}
                                                            color="yellow"
                                                            className="absolute bottom-[0px] right-[0px] bg-gray-500  bg-opacity-50 rounded-full p-[2px]"
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div
                                            className={`flex relative items-center ${
                                                Component === ChatPollCard && 'w-[390px]'
                                            }`}
                                        >
                                            {hoveredMessage === index &&
                                                isPopupOpenIndex === null &&
                                                message.sender.id === userActive.id && (
                                                    <div className="flex">
                                                        <button
                                                            className={`absolute left-[-25px] bottom-[10px] dark:bg-gray-700  p-1 rounded-full hover:bg-gray-300 hover:text-blue-500 mr-1 hover:dark:bg-blue-300 hover:dark:text-gray-100`}
                                                            onClick={() => {
                                                                setIsPopupOpenIndex(index);
                                                            }}
                                                        >
                                                            <FiMoreHorizontal size={15} />
                                                        </button>
                                                        {!message.destroy && (
                                                            <button
                                                                className={`absolute left-[-50px] bottom-[10px] dark:bg-gray-700  p-1 rounded-full hover:bg-gray-300 hover:text-blue-500 hover:dark:bg-blue-300 hover:dark:text-gray-100`}
                                                                onClick={() => {
                                                                    setReplyMessage(message);
                                                                }}
                                                            >
                                                                <MdOutlineReply size={15} />
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            <div className={`relative ${Component === ChatPollCard && 'w-full'}`}>
                                                <Component
                                                    key={index}
                                                    index={index}
                                                    userId={userId}
                                                    activeChat={activeChat}
                                                    message={message}
                                                    reactions={message.reactions}
                                                    showName={
                                                        message.sender.id !== userId && showAvatar && activeChat.isGroup
                                                    }
                                                    replyMessage={message?.replyTo}
                                                    scrollToMessage={scrollToMessage}
                                                />
                                                {message.id === lastMessage.id && message.sender.id === userId && (
                                                    <span className="absolute bottom-[-27px] right-[0]">
                                                        <p className="text-[10px] p-1 bg-gray-300 rounded-lg text-gray-500 mt-1 ">
                                                            {Component !== ChatPollCard
                                                                ? !activeChat.isGroup
                                                                    ? activeChat.participants?.find(
                                                                          (user) => user.accountId !== userId,
                                                                      )?.readed
                                                                        ? 'Đã xem'
                                                                        : 'Đã gửi'
                                                                    : 'Đã nhận'
                                                                : ''}
                                                        </p>
                                                    </span>
                                                )}
                                                {isPopupOpenIndex === index && (
                                                    <PopupMenuForChat
                                                        setIsPopupOpen={setIsPopupOpenIndex}
                                                        position={position}
                                                        message={message}
                                                        setShowModalShareMes={setShowModalShareMes}
                                                        setMessageShare={setMessageShare}
                                                    />
                                                )}
                                                {sumReaction > 0 && !message.destroy && (
                                                    <div
                                                        className="absolute flex items-center bottom-[-5px] right-[10px] rounded-full p-0.5 bg-white text-[12px] cursor-pointer dark:bg-gray-700"
                                                        onClick={() => setOpenReactionChat(true)}
                                                    >
                                                        {message.reactions.slice(0, 2).map((re, index) => {
                                                            return <div key={index}>{re.reaction}</div>;
                                                        })}
                                                        {sumReaction >= 2 && (
                                                            <div className="text-gray-500 text-[10px]">
                                                                {sumReaction}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {hoveredMessage === index &&
                                                    isPopupOpenIndex === null &&
                                                    !message.destroy && (
                                                        <button
                                                            className="absolute bottom-[-5px] right-[-10px] rounded-full p-0.5 text-[12px] bg-white dark:bg-gray-700"
                                                            onMouseEnter={() => setShowPopupReaction(true)}
                                                            onMouseLeave={() =>
                                                                !showPopupReaction && setShowPopupReaction(false)
                                                            }
                                                        >
                                                            <AiOutlineLike className="text-gray-400 " size={13} />
                                                        </button>
                                                    )}

                                                {showPopupReaction &&
                                                    hoveredMessage === index &&
                                                    isPopupOpenIndex === null && (
                                                        <PopupReacttion
                                                            position={position}
                                                            setShowPopupReaction={setShowPopupReaction}
                                                            chatId={activeChat.id}
                                                            message={message}
                                                            reactions={message.reactions}
                                                            userId={userId}
                                                        />
                                                    )}
                                                {openReactionChat && hoveredMessage === index && (
                                                    <PopupReactionChat
                                                        onClose={setOpenReactionChat}
                                                        reactions={message.reactions}
                                                    />
                                                )}
                                            </div>

                                            {hoveredMessage === index &&
                                                isPopupOpenIndex === null &&
                                                message.sender.id !== userActive.id && (
                                                    <div className="relative flex ">
                                                        <button
                                                            className={`absolute dark:bg-gray-700 right-[-25px] bottom-[-10px] p-1 rounded-full hover:bg-gray-300 hover:text-blue-500 hover:dark:bg-blue-300 hover:dark:text-gray-100`}
                                                            onClick={() => {
                                                                setIsPopupOpenIndex(index);
                                                            }}
                                                        >
                                                            <FiMoreHorizontal size={15} />
                                                        </button>
                                                        <button
                                                            className={`absolute dark:bg-gray-700 right-[-50px] bottom-[-10px] p-1 rounded-full hover:bg-gray-300 hover:text-blue-500 hover:dark:bg-blue-300 hover:dark:text-gray-100`}
                                                            onClick={() => {
                                                                setReplyMessage(message);
                                                            }}
                                                        >
                                                            <MdOutlineReply size={15} />
                                                        </button>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    }
                })}
            </div>
            <div>
                <div className="flex bg-white dark:bg-gray-800 border-t dark:border-t-black p-2 ">
                    <div>
                        <LuSticker
                            className="text-2xl cursor-pointer ml-5 hover:text-blue-500 text-gray-600 dark:text-gray-300"
                            onClick={() => dispatch(openEmojiTab('sticker'))}
                        />
                    </div>
                    <div>
                        {/* Input chọn ảnh (ẩn đi) */}
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            ref={inputImageRef}
                            onChange={(event) => handleChangeTypeFile(event, 'image')}
                            className="hidden"
                        />

                        {/* Icon mở thư mục chọn ảnh */}
                        <IoImageOutline
                            className="text-2xl cursor-pointer ml-5 hover:text-blue-500 text-gray-600 dark:text-gray-300"
                            onClick={() => inputImageRef.current.click()} // Kích hoạt input khi nhấn vào icon
                        />
                    </div>
                    <div>
                        {/* Input chọn file (ẩn đi) */}
                        <input
                            type="file"
                            accept=".doc,.docx,.xls,.xlsx,.pdf,.txt,.ppt,.pptx,.csv,.mp4,.mov,.avi,.webm,.mkv"
                            ref={inputFileRef}
                            onChange={(event) => handleFileChange(event, 'file')}
                            className="hidden"
                        />

                        {/* Icon mở thư mục chọn file */}
                        <MdAttachFile
                            className="text-2xl cursor-pointer ml-5 hover:text-blue-500 text-gray-600 dark:text-gray-300"
                            onClick={() => inputFileRef.current.click()}
                        />
                    </div>

                    <FaRegAddressCard className="text-2xl cursor-pointer ml-5 hover:text-blue-500 text-gray-600 dark:text-gray-300" />
                    <div>
                        <CiMicrophoneOn
                            onClick={toggleRecording}
                            className={`text-2xl cursor-pointer ml-5 ${
                                isRecording
                                    ? 'text-red-500 animate-pulse'
                                    : 'hover:text-blue-500 text-gray-600 dark:text-gray-300'
                            }`}
                        />
                    </div>
                </div>
                <div className=" border-t dark:border-t-black p-2 dark:bg-gray-800">
                    <div>
                        {replyMessage && (
                            <div className="relative mb-2 p-2 pl-[15px] bg-gray-100 dark:bg-gray-700 rounded-lg justify-between items-center">
                                <CiCircleRemove
                                    size={20}
                                    className="absolute right-[10px] ml-2 text-gray-500 dark:text-gray-300 cursor-pointer hover:text-red-500"
                                    onClick={() => setReplyMessage(null)}
                                />
                                <div className="flex mb-1">
                                    <p className="text-[12px] text-gray-500 dark:text-gray-300 mr-1">Trả lời:</p>

                                    <p className="text-[12px] font-medium text-gray-600 dark:text-gray-300">
                                        {replyMessage.sender.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[12px] text-gray-600 dark:text-gray-300 max-w-[500px] truncate">
                                        {replyMessage.type === 'file' ? (
                                            <div className="flex items-center">
                                                {getFileIcon(replyMessage.fileType)}
                                                <div className="flex flex-col">
                                                    <p className="text-[12px] font-bold">{replyMessage.fileName}</p>
                                                    <p className="text-[12px] text-gray-500 dark:text-gray-300 pt-1">
                                                        {replyMessage.fileSize}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : replyMessage.type === 'image' ? (
                                            <img
                                                src={replyMessage.content}
                                                alt="content"
                                                className="max-w-[80px] rounded-lg"
                                            />
                                        ) : replyMessage.type === 'gif' ? (
                                            <img
                                                src={replyMessage.content}
                                                alt="GIF"
                                                className="max-w-[80px] rounded-lg "
                                            />
                                        ) : replyMessage.type === 'sticker' ? (
                                            <img
                                                src={replyMessage.content}
                                                alt="GIF"
                                                className="max-w-[50px] rounded-lg "
                                            />
                                        ) : (
                                            replyMessage.content
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center">
                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault(); // Ngăn xuống dòng
                                    handleSendMessage(); // Gọi hàm gửi tin nhắn
                                }
                            }}
                            placeholder={`Nhập tin nhắn`}
                            className="flex-1 p-1 font-base text-[14px] rounded-lg focus:border-blue-500 focus:outline-none
                            h-[30px] max-h-[200px] overflow-y-auto resize-none dark:bg-gray-800 dark:text-gray-300"
                        />

                        <div className="flex items-center">
                            <MdOutlineEmojiEmotions
                                className="text-2xl cursor-pointer ml-3 text-gray-500 mr-3 hover:text-blue-500 dark:text-gray-300"
                                onClick={() => dispatch(openEmojiTab('emoji'))}
                            />
                            {message !== '' ? (
                                <IoMdSend
                                    className="text-2xl cursor-pointer ml-3 text-blue-500 mr-3"
                                    onClick={handleSendMessage}
                                />
                            ) : (
                                <AiFillLike
                                    className="text-2xl cursor-pointer ml-3 text-yellow-500 mr-3"
                                    onClick={() => {
                                        sendMessage(chatId, '👍', 'text', null, null, null, null);
                                        readedChatOfUser(chatId);
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TabMessage;
