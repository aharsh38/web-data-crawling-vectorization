import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebModule } from './web/web.module';
import { LoggerModule } from './common/logger/logger.module';
import { RequestLoggerInterceptor } from './common/interceptors/request-logger.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    WebModule,
    MongooseModule.forRoot(
      `${process.env.MONGO_PROTOCOL}://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}`,
      {
        retryWrites: true,
        appName: process.env.MONGO_APP_NAME,
        dbName: process.env.MONGO_DBNAME,
      },
    ),
  ],
  controllers: [AppController],
  providers: [AppService, RequestLoggerInterceptor],
})
export class AppModule {}
