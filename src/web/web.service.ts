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

    await this.vectorEmbeddingsService.createVectorEmbeddings(
      websiteUrl,
      tokens,
    );
    return tokens;

    // const res = await this.vectorEmbeddingsService.generateVectorEmbeddings(
    //   websiteUrl,
    //   tokens,
    // );
    // return res;
  }

  async fetchResult(query: string, count: number): Promise<string[]> {
    const results = await this.vectorEmbeddingsService.search(query, count);
    return results;
  }
}
