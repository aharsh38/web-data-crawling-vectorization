import { Injectable } from '@nestjs/common';
import { WebScrapperService } from './web-scrapper.service';
import { VectorEmbeddingsService } from './vector-embeddings.service';
import { LogService } from '../common/logger/logger.service';

@Injectable()
export class WebService {
  constructor(
    private readonly logger: LogService,
    private readonly webScrapperService: WebScrapperService,
    private readonly vectorEmbeddingsService: VectorEmbeddingsService,
  ) {}

  async scrapAndEmbed(websiteUrl: string): Promise<any> {
    this.logger.debug(`Request for Scrapping and embedding for ${websiteUrl}`);

    const tokens = await this.webScrapperService.scrap(websiteUrl);

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
    this.logger.debug(
      `Request to query for '${query}' and fetch top ${count} results`,
    );

    const results = await this.vectorEmbeddingsService.search(query, count);
    return results;
  }
}
