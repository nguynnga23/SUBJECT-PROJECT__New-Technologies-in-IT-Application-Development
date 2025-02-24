import { FaPhoneSlash } from 'react-icons/fa';
import { CiMicrophoneOff } from 'react-icons/ci';

function PopupVideoCall({ setVideoCall, activeChat, userActive }) {
    return (
        <div className="w-full h-full">
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                <div className="relative">
                    <div className=" relative bg-gray-100 w-[90vw] h-[90vh] flex items-center justify-center rounded-lg ">
                        {activeChat?.group ? (
                            <div className="flex w-[100%]  flex-wrap gap-2 p-4 overflow-auto">
                                {activeChat.members
                                    .filter((member) => member.id !== userActive.id)
                                    .map((member, index) => (
                                        <div
                                            className="border p-10 min-w-[300px] max-h-[270px] w-[440px] rounded-lg"
                                            key={index}
                                        >
                                            <div className="flex justify-center items-center">
                                                <div>
                                                    <img
                                                        src={member?.avatar}
                                                        alt="avatar"
                                                        className="w-[120px] h-[120px] rounded-full object-cover"
                                                    />
                                                    <p>{member?.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div>
                                <img
                                    src={activeChat?.avatar}
                                    alt="avatar"
                                    className="w-[120px] h-[120px] rounded-full object-cover"
                                />
                                <p>{activeChat?.name}</p>
                            </div>
                        )}

                        <div className="absolute flex items-center justify-center bottom-[5px] right-[5px] border rounded-lg w-[200px] h-[200px]">
                            <img
                                src={userActive?.avatar}
                                alt="avatar"
                                className="w-[50px] h-[50px] rounded-full object-cover"
                            />
                        </div>
                        <div className="absolute flex items-center justify-around bottom-[10px] right-[50%] translate-x-[50%] border rounded-lg w-[70px] h-[30px]">
                            <FaPhoneSlash
                                size={25}
                                onClick={() => setVideoCall(false)}
                                className="text-red-400 hover:bg-gray-200 rounded-full p-1 text-3xl cursor-pointer"
                            />
                            <CiMicrophoneOff size={25} className="hover:bg-gray-200 rounded-full p-1 cursor-pointer" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopupVideoCall;
