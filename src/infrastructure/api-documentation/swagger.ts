import swaggerJsdoc from 'swagger-jsdoc';
import type { Options } from 'swagger-jsdoc';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation for Wiley Technical Assessment API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {},
    },
  },
  apis: [
    './src/application/routes/*.ts',
    './src/application/requests/*.ts',
    './src/application/responses/*.ts',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
