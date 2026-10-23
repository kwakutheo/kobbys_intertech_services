import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';

export function configureApplication(app: INestApplication) {
  const isProd = process.env.NODE_ENV === 'production';

  // Express only resolves req.ip from X-Forwarded-For once it trusts the proxy
  // in front of it. Without this, every visitor behind the same CDN or load
  // balancer would share one throttling bucket.
  const trustedHops = Number.parseInt(process.env.TRUST_PROXY_HOPS ?? '', 10);
  if (Number.isInteger(trustedHops) && trustedHops > 0) {
    app.getHttpAdapter().getInstance().set('trust proxy', trustedHops);
  }

  const customOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow requests with no origin (mobile native apps, server-to-server, curl)
      if (!origin) return callback(null, true);

      // Explicitly allowed origins from environment variable
      if (customOrigins.includes(origin)) return callback(null, true);

      // Allow Vercel deployments (production and preview branches)
      if (/^https:\/\/([a-zA-Z0-9_-]+\.)?vercel\.app$/.test(origin)) {
        return callback(null, true);
      }

      // Allow localhost and loopback (any port)
      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }

      // Allow local Wi-Fi / private network IPs (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
      if (/^https?:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }

      // In development mode, permit all incoming origins for convenience
      if (!isProd) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} not allowed by CORS`), false);
    },
    credentials: true,
  });
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
}
