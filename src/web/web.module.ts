import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { WebService } from './web.service';
import { WebController } from './web.controller';

import { WebScrapEmbeddingsSchema } from '../schemas/web.schema';
import { WebScrapperService } from './web-scrapper.service';
import { VectorEmbeddingsService } from './vector-embeddings.service';
import { LoggerModule } from '../common/logger/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'WebScrapEmbeddings', schema: WebScrapEmbeddingsSchema },
    ]),
    LoggerModule,
  ],
  controllers: [WebController],
  providers: [WebService, WebScrapperService, VectorEmbeddingsService],
})
export class WebModule {}
