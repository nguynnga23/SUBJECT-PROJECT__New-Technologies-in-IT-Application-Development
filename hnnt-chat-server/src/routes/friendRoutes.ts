import { Router } from 'express';
import {
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    deleteFriend,
} from '../controllers/friendController';

const friendRouter = Router();

friendRouter.post('/request', sendFriendRequest); //User1 request friend to User2
friendRouter.delete('/request/cancel/:id', cancelFriendRequest); // User1/User2 cancel request
friendRouter.post('/request/accept/:id', acceptFriendRequest); // User2 accept request User1
friendRouter.delete('/delete/:id', deleteFriend); // User1/User2 delete friendship relationship

export default friendRouter;
