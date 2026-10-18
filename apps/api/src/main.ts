import { NestFactory } from '@nestjs/core';
import { configureApplication } from './app.config.js';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApplication(app);
  const port = process.env.PORT ?? 4000;
  const host = process.env.HOST ?? '0.0.0.0';
  await app.listen(port, host);
}
await bootstrap();
