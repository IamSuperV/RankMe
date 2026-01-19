import { Router } from 'express';
import { createRoom, joinRoom, getRoom } from '../controllers/roomController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// All room actions require auth (even guest)
router.post('/create', authenticateToken, createRoom);
router.post('/join/:code', authenticateToken, joinRoom);
router.get('/:code', getRoom); // Maybe public? But better if authenticated to customize view

export default router;
