import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req, res): void => {
  res.send('Server is running!');
});

const PORT = process.env.PORT ?? '3000';

app.listen(Number(PORT), (): void => {
  console.log(`Server is running on port ${PORT}`);
});
