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
    listBlockRequest,
    cancelBlockRequest,
    getListFriendRequestBySender,
    cancelFriendRequestBySender,
    checkFriend,
    getSentFriendRequests,
    checkFriendRequest,
    syncContacts, // Import the syncContacts function
    getListFriendByKeyword,
} from '../controllers/friendController';

const friendRouter = Router();

friendRouter.post('/request', authenticate, sendFriendRequest); //User1 request friend to User2
friendRouter.delete('/request/cancel/:id', authenticate, cancelFriendRequest); // User1/User2 cancel request
friendRouter.post('/request/accept/:id', authenticate, acceptFriendRequest); // User2 accept request User1
friendRouter.delete('/delete/:id', authenticate, deleteFriend); // User1/User2 delete friendship relationship
friendRouter.get('/list/search/', authenticate, getListFriendByKeyword);
friendRouter.get('/list', authenticate, getListFriend); // Get list friends by userId
friendRouter.get('/request', authenticate, getListFriendRequest); // Updated to match client request
friendRouter.post('/user/block', authenticate, blockRequest); // Block user
friendRouter.get('/user/block/list/:userId', authenticate, listBlockRequest); // Get list block requests
friendRouter.delete('/user/block/:id', authenticate, cancelBlockRequest); // Cancel block request

friendRouter.get('/request/sender/:userId', authenticate, getListFriendRequestBySender); // Get list friend request by senderId
friendRouter.delete('/request/cancel-by-sender/:receiverId', authenticate, cancelFriendRequestBySender); // Updated to match client request
friendRouter.get('/check-friend/:friendId', authenticate, checkFriend); // Check friendship relationship between userId and friendId
friendRouter.get('/request/sender', authenticate, getSentFriendRequests); // Removed redundant userId param
friendRouter.get('/request/check/:friendId', authenticate, checkFriendRequest); // Check if a friend request exists
friendRouter.post('/sync-contacts', authenticate, syncContacts); // Sync contacts with the server

export default friendRouter;
