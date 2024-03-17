import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { LogService } from './common/logger/logger.service';
import { RequestLoggerInterceptor } from './common/interceptors/request-logger.interceptor';

async function bootstrap() {
  const port = parseInt(process.env.PORT, 10) || 3000;

  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(LogService));

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.enableCors();
  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new RequestLoggerInterceptor(app.get(LogService)));

  await app.listen(port).then(async () => {
    app
      .get(LogService)
      .info(`Application is running on: ${await app.getUrl()}`);
  });
}
bootstrap();
