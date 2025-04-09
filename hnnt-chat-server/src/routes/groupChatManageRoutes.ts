import { Router } from 'express';
import {
    createGroupChat,
    addMemberToGroup,
    muteGroup,
    changeGroupRole,
    leaveGroup,
    disbandGroup,
    pinMessage,
    unPinMessage,
    kickMember,
    getPinnedMessage,
    updateGroupName,
} from '../controllers/groupChatManageController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/create', authenticate, createGroupChat);
router.post('/:groupId/add', authenticate, addMemberToGroup);
router.put('/message/:messageId/pin', authenticate, pinMessage);
router.put('/message/:messageId/un-pin', authenticate, unPinMessage);
router.get('/message/:chatId/show-pin', authenticate, getPinnedMessage);
router.put('/mute', authenticate , muteGroup);
router.put('/role', authenticate, changeGroupRole);
router.delete('/:groupId/leave', authenticate, leaveGroup);
router.delete('/:groupId/disband', authenticate, disbandGroup);
router.delete('/:groupId/kick', authenticate, kickMember);
router.put('/:groupId/edit-name', authenticate, updateGroupName);

export default router;
