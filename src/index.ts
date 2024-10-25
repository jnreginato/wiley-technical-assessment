import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req, res): void => {
    res.send('Server is running!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (): void => {
    console.log(`Server is running on port ${PORT}`);
});
