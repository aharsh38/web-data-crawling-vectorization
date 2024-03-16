import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { WebService } from './web.service';
import { WebController } from './web.controller';

import { WebScrapEmbeddingsSchema } from '../schemas/web.schema';
import { WebScrapperService } from './web-scrapper.service';
import { HttpModule } from '@nestjs/axios';
import { VectorEmbeddingsService } from './vector-embeddings.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: 'WebScrapEmbeddings', schema: WebScrapEmbeddingsSchema },
    ]),
  ],
  controllers: [WebController],
  providers: [WebService, WebScrapperService, VectorEmbeddingsService],
})
export class WebModule {}
