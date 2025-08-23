import client from 'prom-client';
import express from 'express';
import logger from './logger.js';
import type { Request, Response } from 'express';

const app = express();

export const restResponseTimeHistogram = new client.Histogram({
  name: 'api_gateway_rest_response_time_duration_seconds',
  help: 'API Gateway REST API response time in seconds',
  labelNames: ['method', 'route', 'status_code']
});

export function startMetricServer() {

  const collectDefaultMetrics = client.collectDefaultMetrics;
  collectDefaultMetrics();

  app.get('/metrics', async(req: Request, res: Response) => {
    res.set("Content-Type", client.register.contentType);

    return res.send(await client.register.metrics());
  })

  app.listen(9100, () => {
    logger.info('Metrics server started at http://localhost:9100');
  })
}

