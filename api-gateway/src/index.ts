import { createApp } from './app.js';
import logger from './utils/logger.js';
import { startMetricServer } from './utils/metrics.js';

const app = createApp();
const mainPort = process.env.PORT ? parseInt(process.env.PORT) : 8080;
app.listen(mainPort, () => {
  logger.info(`API Gateway listening on port ${mainPort}`);

  startMetricServer();
});
