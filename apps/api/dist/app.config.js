import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
export function configureApplication(app) {
    const allowedOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:3000')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
    app.use(helmet());
    app.enableCors({ origin: allowedOrigins, credentials: true });
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
}
//# sourceMappingURL=app.config.js.map