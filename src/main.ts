import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = parseInt(process.env.PORT, 10) || 3000;

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port).then(() => {
    console.log(`service is listening on port: ${port}.`);
  });
}
bootstrap();
