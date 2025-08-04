import express from 'express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import gameRoutes from './routes/games.js';

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

// Request logging
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes - Let the router handle all /api/games/* routes
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

app.listen(port, '0.0.0.0', () => {
  console.log(`API Gateway running on port ${port}`);
  console.log(`API Documentation: http://localhost:${port}/api-docs`);
  console.log(`Game ID Service: ${process.env.GAME_ID_SERVICE_URL || 'http://localhost:8000'}`);
  console.log(`Price Service: ${process.env.PRICE_SERVICE_URL || 'http://localhost:8001'}`);
});
