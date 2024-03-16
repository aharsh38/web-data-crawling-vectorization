import { Injectable } from '@nestjs/common';
import { WebScrapperService } from './web-scrapper.service';
import { VectorEmbeddingsService } from './vector-embeddings.service';

@Injectable()
export class WebService {
  constructor(
    private readonly webScrapperService: WebScrapperService,
    private readonly vectorEmbeddingsService: VectorEmbeddingsService,
  ) {}

  async scrapAndEmbed(websiteUrl: string): Promise<any> {
    const tokens = await this.webScrapperService.scrap(websiteUrl);
    console.log(tokens.length);

    await this.vectorEmbeddingsService.createVectorEmbeddings(
      websiteUrl,
      tokens,
    );
    return {
      message: 'Processing completed',
      websiteUrl,
      tokens,
    };
  }

  async fetchResult(
    query: string,
    count: number,
  ): Promise<Record<string, unknown>[]> {
    const results = await this.vectorEmbeddingsService.search(query, count);
    return results;
  }
}
