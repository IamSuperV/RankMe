import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// AUTH
export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { username, email, password: hashedPassword }
        });
        const token = jwt.sign({ id: user.id }, JWT_SECRET);
        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(400).json({ message: 'Registration failed', error });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id }, JWT_SECRET);
        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ error });
    }
};

// BENCHMARK
export const submitScore = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;
        const { category, score, rawStats } = req.body;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const newScore = await prisma.score.create({
            data: {
                userId,
                category,
                score,
                rawStats: rawStats || {}
            }
        });
        res.json(newScore);
    } catch (error) {
        res.status(500).json({ error });
    }
};

// RANKING
export const getGlobalLeaderboard = async (req: Request, res: Response) => {
    try {
        const { category } = req.query;
        // Optimization: Raw query or grouped query ideally
        const scores = await prisma.score.findMany({
            where: { category: String(category) },
            orderBy: { score: category === 'REACTION_TIME' || category === 'AIM_TRAINER' ? 'asc' : 'desc' },
            take: 50,
            include: { user: { select: { username: true } } }
        });
        res.json(scores);
    } catch (error) {
        res.status(500).json({ error });
    }
};

// ROOMS (Simplified)
export const createRoom = async (req: Request, res: Response) => {
    // Logic later
    res.json({ message: "Not implemented yet" });
}
