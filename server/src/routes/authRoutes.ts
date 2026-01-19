import { Router } from 'express';
import { guestLogin, register, login } from '../controllers/authController';

const router = Router();

router.post('/guest', guestLogin);
router.post('/register', register);
router.post('/login', login);

export default router;
