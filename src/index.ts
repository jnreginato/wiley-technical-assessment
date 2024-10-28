import 'module-alias/register';
import dotenv from 'dotenv';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import authRouter from '@/application/routes/auth';
import coursesRouter from '@/application/routes/courses';
import swaggerSpec from '@/infrastructure/api-documentation/swagger';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api', authRouter);
app.use('/api', coursesRouter);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT ?? '3000';

app.listen(Number(PORT), (): void => {
  console.log(`Server is running on port ${PORT}`);
});
