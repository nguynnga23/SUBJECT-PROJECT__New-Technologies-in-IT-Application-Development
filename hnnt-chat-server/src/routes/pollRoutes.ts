import express from 'express';
import { createPoll, getPollsByChat, votePollOption, deletePoll, getPollById } from '../controllers/pollController';

const router = express.Router();

router.post('/', createPoll); // Create a new poll
router.get('/chat/:chatId', getPollsByChat); // Get polls by chat ID
router.get('/:pollId', getPollById); // Get a poll by ID
router.post('/vote', votePollOption); // Vote on a poll option
router.delete('/:pollId', deletePoll); // Delete a poll

export default router;
