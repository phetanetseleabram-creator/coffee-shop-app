import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import menuRouter from './routes/menu.js';
import ordersRouter from './routes/orders.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL?.split(',') || '*',
}));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.use('/api/menu', menuRouter);
app.use('/api/orders', ordersRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`API running on port ${PORT}`));