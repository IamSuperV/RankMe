import { Router } from 'express';
import { submitScore, getScores } from '../controllers/benchmarkController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/submit', authenticateToken, submitScore);
router.get('/', getScores);

export default router;
