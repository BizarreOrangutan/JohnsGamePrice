import express from 'express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import responseTime from 'response-time';
import logger from './utils/logger.js';
import { restResponseTimeHistogram } from './utils/metrics.js';
import { errorMiddleware } from './utils/errorHandler.js';
import type { Request, Response } from 'express';

// Import gameRoutes AFTER other imports
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
  app.use(responseTime((req: Request, res: Response, time: number) => {
    if ((req.route?.path)) {
      restResponseTimeHistogram.observe(
        {
          method: req.method,
          route: req.route.path,
          status_code: res.statusCode,
        },
        time/1000
      );
    }
  }))

  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  // Request logging (skip in test environment)
  if (process.env.NODE_ENV !== 'test') {
    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        query: req.query,
        requestId: req.get('x-request-id') || 'unknown',
      });
      next();
    });
  }

  // Routes
  app.use('/api/games', gameRoutes);

  // Health check route
  app.get('/health', (req: express.Request, res: express.Response) => {
    logger.info('Health check requested', {
      ip: req.ip,
      requestId: req.get('x-request-id') || 'unknown',
    });
    res.status(200).json({
      status: 'healthy',
      service: 'api-gateway',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  });

  // 404 handler
  app.use(/(.*)/, (req: express.Request, res: express.Response) => {
    logger.warn(`404 - Endpoint not found: ${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      requestId: req.get('x-request-id') || 'unknown',
    });
    res.status(404).json({
      error: 'Endpoint not found',
      details: `The requested endpoint ${req.method} ${req.path} was not found`,
      availableEndpoints: [
        'GET /api/games/search?query=<game>',
        'GET /api/games/prices?id=<game-id>',
        'GET /api-docs - API Documentation',
        'GET /health - Health check',
      ],
      timestamp: new Date().toISOString(),
    });
  });

  // Error handling middleware (must be last)
  app.use(errorMiddleware);

  // Log app initialization (only in non-test env)
  if (process.env.NODE_ENV !== 'test') {
    logger.info(`API Gateway initialized on port ${port}`, {
      environment: process.env.NODE_ENV || 'development',
      port,
      version: '1.0.0',
    });
  }

  return app;
}