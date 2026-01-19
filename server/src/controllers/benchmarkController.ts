import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schema for score submission
const scoreSchema = z.object({
    category: z.string(),
    value: z.number(),
    roomId: z.string().optional(),
    rawStats: z.record(z.any()).optional(),
});

interface AuthRequest extends Request {
    user?: {
        userId: string;
        guest: boolean;
    };
}

export const submitScore = async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const { category, value, roomId, rawStats } = scoreSchema.parse(req.body);
        const userId = req.user.userId;

        // Basic validity check (can be expanded based on category)
        if (value < 0) return res.status(400).json({ error: 'Invalid score value' });

        const score = await prisma.score.create({
            data: {
                userId,
                category,
                value,
                roomId,
                rawStats: rawStats ? (rawStats as any) : {}, // Cast to any to satisfy Prisma Json input
            },
        });

        res.json(score);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error(error);
        res.status(500).json({ error: 'Failed to submit score' });
    }
};

export const getScores = async (req: Request, res: Response) => {
    const { category, roomId, userId } = req.query;

    try {
        const scores = await prisma.score.findMany({
            where: {
                category: category ? String(category) : undefined,
                roomId: roomId ? String(roomId) : undefined,
                userId: userId ? String(userId) : undefined,
            },
            include: {
                user: {
                    select: { username: true, guest: true },
                },
            },
            orderBy: {
                value: 'desc', // Assuming higher is better for now; logic might change per category
            },
            take: 50,
        });

        res.json(scores);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch scores' });
    }
};
