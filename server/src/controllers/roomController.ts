import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Helper to generate 6-char room code
const generateRoomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Ensure request has user attached (from middleware)
interface AuthRequest extends Request {
    user?: {
        userId: string;
        guest: boolean;
    };
}

export const createRoom = async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { name } = req.body; // Optional room name
    const userId = req.user.userId;
    const code = generateRoomCode();

    try {
        const room = await prisma.room.create({
            data: {
                code,
                name: name || `Room ${code}`,
                adminId: userId,
                members: {
                    create: {
                        userId: userId,
                    },
                },
            },
            include: {
                members: true,
            }
        });

        res.json(room);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create room' });
    }
};

export const joinRoom = async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { code } = req.params;
    const userId = req.user.userId;

    try {
        const room = await prisma.room.findUnique({ where: { code: String(code) } });
        if (!room) return res.status(404).json({ error: 'Room not found' });

        // Check if already member
        const existingMember = await prisma.roomMember.findUnique({
            where: {
                roomId_userId: {
                    roomId: room.id,
                    userId: userId,
                },
            },
        });

        if (existingMember) {
            return res.json({ message: 'Already joined', room });
        }

        await prisma.roomMember.create({
            data: {
                roomId: room.id,
                userId: userId,
            },
        });

        res.json({ message: 'Joined room successfully', room });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to join room' });
    }
};

export const getRoom = async (req: AuthRequest, res: Response) => {
    const { code } = req.params;

    try {
        const room = await prisma.room.findUnique({
            where: { code: String(code) },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, username: true, guest: true },
                        },
                    },
                },
                // We'll add scores later
            },
        });

        if (!room) return res.status(404).json({ error: 'Room not found' });

        res.json(room);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch room' });
    }
};
