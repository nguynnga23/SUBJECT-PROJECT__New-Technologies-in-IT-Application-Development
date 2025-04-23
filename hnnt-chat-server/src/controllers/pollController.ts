import { Request, Response } from 'express';
import prisma from '../utils/prismaClient';

// Create a new poll
export const createPoll = async (req: Request, res: Response) => {
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

        res.status(201).json(poll);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create poll' });
    }
};

// Get all polls for a chat
export const getPollsByChat = async (req: Request, res: Response) => {
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

// Vote on a poll option
export const votePollOption = async (req: Request, res: Response) => {
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
export const deletePoll = async (req: Request, res: Response) => {
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

// Get poll results
export const getPollResults = async (req: Request, res: Response) => {
    try {
        const { pollId } = req.params;
        const polls = await prisma.poll.findMany({
            where: {
                chatId: pollId,
            },
            select: {
                id: true,
                title: true,
                endsAt: true,
                creatorId: true,
                chatId: true,
                options: {
                    select: {
                        id: true,
                        text: true,
                        _count: {
                            select: {
                                votes: true,
                            },
                        },
                        votes: {
                            select: {
                                voterId: true,
                            },
                        },
                    },
                },
            },
        });

        res.status(200).json(polls);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch poll results' });
    }
};

// getPollById
export const getPollById = async (req: Request, res: Response) => {
    try {
        const { pollId } = req.params;

        const poll = await prisma.poll.findUnique({
            where: { id: pollId },
            include: { options: { include: { votes: true } } },
        });

        res.status(200).json(poll);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch poll' });
    }
};

// updatePollVotes
export const updatePollVotes = async (req: Request, res: Response) => {
    try {
        const { pollId, optionIds, voterId } = req.body;

        // 1 lấy danh sách tất cả các optionId của pollid
        const allOptions = await prisma.pollOption.findMany({
            where: { pollId },
            select: { id: true },
        });
        const allOptionIds = allOptions.map((o) => o.id);

        // 2 lấy danh sách tất cả các optionId đã vote của voterId
        const existingVotes = await prisma.pollVote.findMany({
            where: {
                pollOptionId: { in: allOptionIds },
                voterId,
            },
        });
        const existingOptionIds = existingVotes.map((v) => v.pollOptionId);

        // Những optionId cần thêm mới
        const toCreate = optionIds.filter((id: string) => !existingOptionIds.includes(id));

        // Những optionId cần xóa
        const toDelete = existingOptionIds.filter((id) => !optionIds.includes(id));

        // Xóa vote cũ không còn trong danh sách mới
        await prisma.pollVote.deleteMany({
            where: {
                pollOptionId: { in: toDelete },
                voterId,
            },
        });

        // Tạo vote mới
        await prisma.pollVote.createMany({
            data: toCreate.map((optionId: string) => ({
                pollOptionId: optionId,
                voterId,
            })),
        });

        res.status(201).json({ message: 'Votes updated successfully', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update poll votes' });
    }
};
