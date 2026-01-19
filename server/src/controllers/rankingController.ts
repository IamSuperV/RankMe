import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getGlobalLeaderboard = async (req: Request, res: Response) => {
    const { category } = req.query;

    if (!category) {
        return res.status(400).json({ error: 'Category is required' });
    }

    try {
        // Basic leaderboard: Top scores by category
        // In a real app, might want "max score per user" using groupBy
        const leaderboard = await prisma.score.findMany({
            where: {
                category: String(category),
            },
            orderBy: {
                value: 'desc',
            },
            take: 20,
            include: {
                user: {
                    select: { username: true, guest: true },
                },
            },
        });

        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
};

export const getRoomLeaderboard = async (req: Request, res: Response) => {
    const { code } = req.params;
    const { category } = req.query;
    const categoryParam = req.query.category;
    const category = typeof categoryParam === 'string' && categoryParam.length > 0 ? categoryParam : undefined;

    try {
        const room = await prisma.room.findUnique({ where: { code } });
        if (!room) return res.status(404).json({ error: 'Room not found' });

        const leaderboard = await prisma.score.findMany({
            where: {
                roomId: room.id,
                category: category,
            },
            orderBy: {
                value: 'desc',
            },
            take: 50,
            include: {
                user: {
                    select: { username: true },
                },
            },
        });

        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch room leaderboard' });
    }
};
