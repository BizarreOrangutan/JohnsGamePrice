import { createApp } from './app.js';

const app = createApp();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 8080;

app.listen(port, '0.0.0.0', () => {
  console.log(`API Gateway running on port ${port}`);
  console.log(`API Documentation: http://localhost:${port}/api-docs`);
  console.log(`Game ID Service: ${process.env.GAME_ID_SERVICE_URL || 'http://localhost:8000'}`);
  console.log(`Price Service: ${process.env.PRICE_SERVICE_URL || 'http://localhost:8001'}`);
});
