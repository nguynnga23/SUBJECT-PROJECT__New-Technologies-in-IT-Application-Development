import express from 'express';
import {
    createPoll,
    getPollsByChat,
    votePollOption,
    deletePoll,
    getPollResults,
    getPollById,
    updatePollVotes,
} from '../controllers/pollController';

const router = express.Router();

router.post('/', createPoll); // Create a new poll
router.get('/:chatId', getPollsByChat); // Get polls by chat ID
router.post('/vote', votePollOption); // Vote on a poll option
router.delete('/:pollId', deletePoll); // Delete a poll
router.get('/results/:pollId', getPollResults); // Get poll results
router.get('/pollChat/:pollId', getPollById);
router.post('/update-vote', updatePollVotes); // Update poll votes

export default router;
