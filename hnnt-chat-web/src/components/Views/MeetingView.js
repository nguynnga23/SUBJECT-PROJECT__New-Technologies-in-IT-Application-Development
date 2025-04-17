import { useMeeting } from '@videosdk.live/react-sdk';
import { useState } from 'react';
import Controls from '../Views/Controls';
import PopupVideoCall from '../Popup/PopupVideoCall';

function MeetingView(props) {
    const [joined, setJoined] = useState(null);
    //Get the method which will be used to join the meeting.
    //We will also get the participants list to display all participants
    const { join, participants } = useMeeting({
        //callback for when meeting is joined successfully
        onMeetingJoined: () => {
            setJoined('JOINED');
        },
        //callback for when meeting is left
        onMeetingLeft: () => {
            props.onMeetingLeave();
        },
    });
    const joinMeeting = () => {
        setJoined('JOINING');
        join();
    };

    return (
        <div className="container">
            {joined && joined === 'JOINED' ? (
                <div>
                    <Controls />
                    {[...participants.keys()].map((participantId) => (
                        <PopupVideoCall
                            setVideoCall={props.setVideoCall}
                            activeChat={props.activeChat}
                            userActive={props.userActive}
                            participantId={participantId}
                            key={participantId}
                        />
                    ))}
                </div>
            ) : joined && joined === 'JOINING' ? (
                <p>Joining the meeting...</p>
            ) : (
                <button onClick={joinMeeting}>Join</button>
            )}
        </div>
    );
}

export default MeetingView;
