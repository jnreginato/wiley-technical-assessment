import 'module-alias/register';
import dotenv from 'dotenv';
import express from 'express';
import authRouter from '@/application/routes/auth';
import coursesRouter from '@/application/routes/courses';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req, res): void => {
  res.send('Server is running!');
});
app.use('/api', authRouter);
app.use('/api', coursesRouter);

const PORT = process.env.PORT ?? '3000';

app.listen(Number(PORT), (): void => {
  console.log(`Server is running on port ${PORT}`);
});
