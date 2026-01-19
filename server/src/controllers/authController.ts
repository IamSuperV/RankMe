import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_dev_key';

const generateToken = (userId: string, guest: boolean) => {
    return jwt.sign({ userId, guest }, JWT_SECRET, { expiresIn: '7d' });
};

// --- Schema Validation ---
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    username: z.string().min(3),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const guestLogin = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.create({
            data: {
                guest: true,
                username: `Guest-${Math.floor(Math.random() * 10000)}`,
            },
        });

        const token = generateToken(user.id, true);
        res.json({ token, user: { id: user.id, username: user.username, guest: true } });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create guest user' });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, username } = registerSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                username,
                guest: false,
            },
        });

        const token = generateToken(user.id, false);
        res.json({ token, user: { id: user.id, email: user.email, username: user.username, guest: false } });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: 'Registration failed' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user.id, user.guest);
        res.json({ token, user: { id: user.id, email: user.email, username: user.username, guest: user.guest } });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: 'Login failed' });
    }
};
