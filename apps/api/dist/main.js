import { NestFactory } from '@nestjs/core';
import { configureApplication } from './app.config.js';
import { AppModule } from './app.module.js';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    configureApplication(app);
    await app.listen(process.env.PORT ?? 4000);
}
await bootstrap();
//# sourceMappingURL=main.js.map