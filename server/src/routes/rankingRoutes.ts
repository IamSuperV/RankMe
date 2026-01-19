import { Router } from 'express';
import { getGlobalLeaderboard, getRoomLeaderboard } from '../controllers/rankingController';

const router = Router();

router.get('/global', getGlobalLeaderboard);
router.get('/room/:code', getRoomLeaderboard);

export default router;
