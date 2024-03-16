import { Injectable } from '@nestjs/common';
import { WebScrapperService } from './web-scrapper.service';
import { VectorEmbeddingsService } from './vector-embeddings.service';

@Injectable()
export class WebService {
  constructor(
    private readonly webScrapperService: WebScrapperService,
    private readonly vectorEmbeddingsService: VectorEmbeddingsService,
  ) {}

  async scrapAndEmbed(websiteUrl: string): Promise<string[]> {
    const tokens = await this.webScrapperService.scrap(websiteUrl);
    await this.vectorEmbeddingsService.createVectorEmbeddings(
      websiteUrl,
      tokens,
    );
    return tokens;
  }

  async fetchResult(query: string): Promise<string[]> {
    const results = await this.vectorEmbeddingsService.search(query);
    console.log(results);
    return results;
  }
}
