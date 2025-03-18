import { Router } from 'express';
import {
    createGroupChat,
    addMemberToGroup,
    muteGroup,
    changeGroupRole,
    leaveGroup,
    disbandGroup
} from '../controllers/groupChatManageController';

const router = Router();

router.post('/create', createGroupChat);
router.post('/:groupId/add', addMemberToGroup);
// router.put('/message/:messageId/pin', pinMessage);
router.put('/mute', muteGroup);
router.put('/role', changeGroupRole);
router.delete('/:groupId/leave', leaveGroup);
router.delete('/:groupId/disband', disbandGroup);

export default router;
