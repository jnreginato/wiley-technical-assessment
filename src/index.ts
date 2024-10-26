import dotenv from 'dotenv';
import express from 'express';
import authRouter from '@/routes/auth';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req, res): void => {
  res.send('Server is running!');
});
app.use('/api', authRouter);

const PORT = process.env.PORT ?? '3000';

app.listen(Number(PORT), (): void => {
  console.log(`Server is running on port ${PORT}`);
});
