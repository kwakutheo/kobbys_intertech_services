import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
export function configureApplication(app) {
    const isProd = process.env.NODE_ENV === 'production';
    const trustedHops = Number.parseInt(process.env.TRUST_PROXY_HOPS ?? '', 10);
    if (Number.isInteger(trustedHops) && trustedHops > 0) {
        app.getHttpAdapter().getInstance().set('trust proxy', trustedHops);
    }
    const customOrigins = (process.env.CORS_ORIGINS ?? '')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
    app.use(helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    }));
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            if (customOrigins.includes(origin))
                return callback(null, true);
            if (/^https:\/\/([a-zA-Z0-9_-]+\.)?vercel\.app$/.test(origin)) {
                return callback(null, true);
            }
            if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
                return callback(null, true);
            }
            if (/^https?:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/.test(origin)) {
                return callback(null, true);
            }
            if (!isProd) {
                return callback(null, true);
            }
            return callback(new Error(`Origin ${origin} not allowed by CORS`), false);
        },
        credentials: true,
    });
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
}
//# sourceMappingURL=app.config.js.map