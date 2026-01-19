import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/authRoutes';
import roomRoutes from './routes/roomRoutes';
import benchmarkRoutes from './routes/benchmarkRoutes';
import rankingRoutes from './routes/rankingRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/benchmarks', benchmarkRoutes);
app.use('/api/rankings', rankingRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'RankMe API is running', timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
