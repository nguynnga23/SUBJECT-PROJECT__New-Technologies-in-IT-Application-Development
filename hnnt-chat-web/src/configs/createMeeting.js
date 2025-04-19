//This is the Auth token, you will use it to generate a meeting and connect to it
export const authToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI5MzE4YWY4NS1hM2E3LTRlMDQtOGE0YS1mZmM0M2JlZjMyYWIiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc0NDc5ODg2MiwiZXhwIjoxNzQ1NDAzNjYyfQ.xwle1rtuF3EH6ypjTGz6asnyLT-vfuwwORKEMqVROjg';

// API call to create a meeting
export const createMeeting = async () => {
    const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
        method: 'POST',
        headers: {
            authorization: `${authToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    });
    //Destructuring the roomId from the response
    const { roomId } = await res.json();
    return roomId;
};
