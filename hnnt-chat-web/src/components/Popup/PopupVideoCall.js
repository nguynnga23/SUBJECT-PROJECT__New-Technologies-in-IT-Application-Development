import { FaPhoneSlash } from 'react-icons/fa';
import { CiMicrophoneOff } from 'react-icons/ci';
import { IoCameraOutline } from 'react-icons/io5';
import { LuCameraOff } from 'react-icons/lu';
import { CiMicrophoneOn } from 'react-icons/ci';

import { useEffect, useMemo, useRef, useState } from 'react';
import { socket } from '../../configs/socket';
import { useParticipant } from '@videosdk.live/react-sdk';
import ReactPlayer from 'react-player';

function PopupVideoCall(props) {
    const micRef = useRef(null);
    const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } = useParticipant(props.participantId);

    const videoStream = useMemo(() => {
        if (webcamOn && webcamStream) {
            const mediaStream = new MediaStream();
            mediaStream.addTrack(webcamStream.track);
            return mediaStream;
        }
    }, [webcamStream, webcamOn]);

    useEffect(() => {
        if (micRef.current) {
            if (micOn && micStream) {
                const mediaStream = new MediaStream();
                mediaStream.addTrack(micStream.track);

                micRef.current.srcObject = mediaStream;
                micRef.current.play().catch((error) => console.error('videoElem.current.play() failed', error));
            } else {
                micRef.current.srcObject = null;
            }
        }
    }, [micStream, micOn]);

    return (
        <div className="w-full h-full">
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                <div className="relative">
                    <div className=" relative bg-gray-100 w-[90vw] h-[90vh] flex items-center justify-center rounded-lg ">
                        {props.activeChat?.group ? (
                            <div className="flex w-[100%]  flex-wrap gap-2 p-4 overflow-auto">
                                {props.activeChat.members
                                    .filter((member) => member.id !== props.userActive.id)
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
                                {/* <img
                                    src={props.activeChat?.avatar}
                                    alt="avatar"
                                    className="w-[120px] h-[120px] rounded-full object-cover"
                                />

                                <p>{props.activeChat?.name}</p> */}
                                <audio ref={micRef} autoPlay playsInline muted={isLocal} />
                                {webcamOn && (
                                    <ReactPlayer
                                        //
                                        playsinline // extremely crucial prop
                                        pip={false}
                                        light={false}
                                        controls={false}
                                        muted={true}
                                        playing={true}
                                        //
                                        url={videoStream}
                                        //
                                        height={'300px'}
                                        width={'300px'}
                                        onError={(err) => {
                                            console.log(err, 'participant video error');
                                        }}
                                    />
                                )}
                            </div>
                        )}

                        <div className="absolute flex items-center justify-center bottom-[5px] right-[5px] border rounded-lg w-[200px] h-[200px]">
                            {/* <img
                                src={userActive?.avatar}
                                alt="avatar"
                                className="w-[50px] h-[50px] rounded-full object-cover"
                            /> */}
                            {/* <video ref={props.myVideoRef} muted autoPlay style={{ width: '300px' }} /> */}
                            <audio ref={micRef} autoPlay playsInline muted={isLocal} />
                            {webcamOn && (
                                <ReactPlayer
                                    //
                                    playsinline // extremely crucial prop
                                    pip={false}
                                    light={false}
                                    controls={false}
                                    muted={true}
                                    playing={true}
                                    //
                                    url={videoStream}
                                    //
                                    height={'300px'}
                                    width={'300px'}
                                    onError={(err) => {
                                        console.log(err, 'participant video error');
                                    }}
                                />
                            )}
                        </div>
                        <div className="absolute flex items-center justify-around bottom-[10px] right-[50%] translate-x-[50%] border rounded-lg w-[70px] h-[30px]">
                            <FaPhoneSlash
                                size={25}
                                onClick={() => props.setVideoCall(false)}
                                className="text-red-400 hover:bg-gray-200 rounded-full p-1 text-3xl cursor-pointer"
                            />
                            {micOn ? (
                                <CiMicrophoneOn
                                    size={25}
                                    className="hover:bg-gray-200 rounded-full p-1 cursor-pointer"
                                />
                            ) : (
                                <CiMicrophoneOff
                                    size={25}
                                    className="hover:bg-gray-200 rounded-full p-1 cursor-pointer"
                                />
                            )}
                            {webcamOn ? (
                                <IoCameraOutline
                                    size={25}
                                    className="text-green-400 hover:bg-gray-200 rounded-full p-1 cursor-pointer"
                                />
                            ) : (
                                <LuCameraOff
                                    size={25}
                                    className="text-red-400 hover:bg-gray-200 rounded-full p-1 cursor-pointer"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopupVideoCall;
