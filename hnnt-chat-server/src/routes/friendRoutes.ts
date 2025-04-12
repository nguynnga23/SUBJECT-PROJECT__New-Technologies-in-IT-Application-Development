import { Router } from 'express';
import { authenticate } from '../middleware/auth';

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
    getListFriendRequestBySender,
    cancelFriendRequestBySender,
    checkFriend,
    getSentFriendRequests,
} from '../controllers/friendController';

const friendRouter = Router();

friendRouter.post('/request', authenticate, sendFriendRequest); //User1 request friend to User2
friendRouter.delete('/request/cancel/:id', authenticate, cancelFriendRequest); // User1/User2 cancel request
friendRouter.post('/request/accept/:id', authenticate, acceptFriendRequest); // User2 accept request User1
friendRouter.delete('/delete/:id', authenticate, deleteFriend); // User1/User2 delete friendship relationship
friendRouter.get('/list', authenticate, getListFriend); // Get list friends by userId
friendRouter.get('/request', authenticate, getListFriendRequest); // Ensure this matches the client request
friendRouter.post('/user/block', authenticate, blockRequest); // Block user
friendRouter.get('/user/block/list/:userId', authenticate, ListBlockRequest); // Get list block requests
friendRouter.delete('/user/block/:id', authenticate, CancelBlockRequest); // Cancel block request

friendRouter.get('/request/sender/:userId', authenticate, getListFriendRequestBySender); // Get list friend request by senderId
friendRouter.delete('/request/cancel-by-sender/:receiverId', authenticate, cancelFriendRequestBySender); // User1/User2 cancel request
friendRouter.get('/check-friend/:friendId', authenticate, checkFriend); // Check friendship relationship between userId and friendId
friendRouter.get('/request/sender/', authenticate, getSentFriendRequests); // Ensure this matches the client request
export default friendRouter;
