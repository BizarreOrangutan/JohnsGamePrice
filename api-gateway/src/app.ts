import express from 'express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import gameRoutes from './routes/games.js';

export function createApp() {
  const app = express();
  const port: number = process.env.PORT ? parseInt(process.env.PORT) : 8080;

  // Swagger configuration
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Johns Game Price API',
        version: '1.0.0',
        description: 'API Gateway for game price tracking',
      },
      servers: [
        {
          url: `http://localhost:${port}`,
          description: 'Development server',
        },
      ],
    },
    apis: ['./src/routes/*.ts', './src/index.ts'],
  };

  const specs = swaggerJsdoc(swaggerOptions);

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  // Request logging (skip in test environment)
  if (process.env.NODE_ENV !== 'test') {
    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  // Routes
  app.use('/api/games', gameRoutes);

  // 404 handler
  app.use(/(.*)/, (req: express.Request, res: express.Response) => {
    res.status(404).json({
      error: 'Endpoint not found',
      availableEndpoints: [
        'GET /api/games/search?query=<game>',
        'GET /api-docs - API Documentation',
      ],
    });
  });

  // Error handling middleware
  app.use(
    (error: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error('Unhandled error:', error);
      res.status(500).json({
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      });
    }
  );

  return app;
}