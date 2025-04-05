import { Router } from 'express';
import {
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    deleteFriend,
    getListFriend,
    getListFriendRequest,
    blockRequest,
    ListBlockRequest,
    CancelBlockRequest,
    getListFriendByKeyword,
} from '../controllers/friendController';
import { authenticate } from '../middleware/auth';

const friendRouter = Router();

friendRouter.post('/request', sendFriendRequest); //User1 request friend to User2
friendRouter.delete('/request/cancel/:id', cancelFriendRequest); // User1/User2 cancel request
friendRouter.post('/request/accept/:id', acceptFriendRequest); // User2 accept request User1
friendRouter.delete('/delete/:id', deleteFriend); // User1/User2 delete friendship relationship
friendRouter.get('/list/search/', authenticate, getListFriendByKeyword);
friendRouter.get('/list', authenticate, getListFriend); // Get list friends by userId
friendRouter.get('/request/:userId', getListFriendRequest); // Get list friend request by userId
friendRouter.post('/user/block', blockRequest); // Block user
friendRouter.get('/user/block/list/:userId', ListBlockRequest); // Get list block requests
friendRouter.delete('/user/block/:id', CancelBlockRequest); // Cancel block request

export default friendRouter;
