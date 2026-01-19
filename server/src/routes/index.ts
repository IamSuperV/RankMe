import { Router } from 'express';
import * as Ctrl from '../controllers';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Middleware
const auth = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

router.post('/auth/register', Ctrl.register);
router.post('/auth/login', Ctrl.login);

router.post('/benchmarks', auth, Ctrl.submitScore);

router.get('/rankings/global', Ctrl.getGlobalLeaderboard);

export default router;
