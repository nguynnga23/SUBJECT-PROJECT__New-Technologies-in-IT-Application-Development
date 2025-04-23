import { Request, Response } from 'express';
import prisma from '../utils/prismaClient';

// Create a new poll
export const createPoll = async (req: Request, res: Response): Promise<void> => {
    try {
        const { chatId, creatorId, title, endsAt, options } = req.body;

        const poll = await prisma.poll.create({
            data: {
                title,
                endsAt,
                chat: { connect: { id: chatId } },
                creator: { connect: { id: creatorId } },
                options: {
                    create: (options as { text: string }[]).map((option) => ({ text: option.text })),
                },
            },
            include: { options: true },
        });

        // Create a message with type 'poll' and content containing the pollId
        await prisma.message.create({
            data: {
                type: 'poll',
                content: poll.id,
                chat: { connect: { id: chatId } },
                sender: { connect: { id: creatorId } },
            },
        });

        res.status(201).json(poll);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create poll' });
    }
};

// Get all polls for a chat
export const getPollsByChat = async (req: Request, res: Response): Promise<void> => {
    try {
        const { chatId } = req.params;

        const polls = await prisma.poll.findMany({
            where: { chatId },
            include: { options: { include: { votes: true } } },
        });

        res.status(200).json(polls);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch polls' });
    }
};

// Get a poll by ID
export const getPollById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { pollId } = req.params;

        const poll = await prisma.poll.findUnique({
            where: { id: pollId },
            include: { options: { include: { votes: true } } },
        });

        if (!poll) {
            res.status(404).json({ error: 'Poll not found' });
        }

        res.status(200).json(poll);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch poll' });
    }
};

// Vote on a poll option
export const votePollOption = async (req: Request, res: Response): Promise<void> => {
    try {
        const { pollOptionId, voterId } = req.body;

        const vote = await prisma.pollVote.create({
            data: {
                pollOptionId,
                voterId,
            },
        });

        res.status(201).json(vote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to vote on poll option' });
    }
};

// Delete a poll
export const deletePoll = async (req: Request, res: Response): Promise<void> => {
    try {
        const { pollId } = req.params;

        await prisma.poll.delete({
            where: { id: pollId },
        });

        res.status(200).json({ message: 'Poll deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete poll' });
    }
};
