import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
import { CohereEmbeddings } from '@langchain/cohere';
import { MongoClient, Collection } from 'mongodb';
import { WebScrapEmbeddings } from '../schemas/web.schema';
import { LogService } from '../common/logger/logger.service';

@Injectable()
export class VectorEmbeddingsService {
  private collection: Collection;
  private readonly mongoUri: string;

  constructor(private readonly logger: LogService) {
    this.mongoUri = `${process.env.MONGO_PROTOCOL}://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}`;
    const client = new MongoClient(this.mongoUri);
    this.collection = client
      .db(process.env.MONGO_DBNAME)
      .collection(WebScrapEmbeddings.name.toLowerCase());
  }

  async createVectorEmbeddings(
    websiteUrl: string,
    tokens: string[],
  ): Promise<void> {
    try {
      await MongoDBAtlasVectorSearch.fromTexts(
        tokens,
        new Array(tokens.length).fill(null).map(() => ({ websiteUrl })),
        new CohereEmbeddings(),
        {
          collection: this.collection,
          indexName: process.env.MONGO_SEARCH_INDEX_NAME,
          textKey: process.env.MONGO_SEARCH_TEXT_KEY,
          embeddingKey: process.env.MONGO_SEARCH_ENBEDDING_KEY,
        },
      );
      return;
    } catch (error) {
      this.logger.error(error);

      throw new HttpException(
        {
          message: `Error while create Vector Embeddings: ${error.message}`,
          httpCode: error?.status
            ? error?.status
            : HttpStatus.INTERNAL_SERVER_ERROR,
        },
        error?.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async search(
    query: string,
    count: number,
  ): Promise<Record<string, unknown>[]> {
    try {
      const vectorStore = new MongoDBAtlasVectorSearch(new CohereEmbeddings(), {
        collection: this.collection,
        indexName: process.env.MONGO_SEARCH_INDEX_NAME,
        textKey: process.env.MONGO_SEARCH_TEXT_KEY,
        embeddingKey: process.env.MONGO_SEARCH_ENBEDDING_KEY,
      });

      const results = await vectorStore.similaritySearch(query, count);

      const response = results.map((res) => {
        return {
          website: res.metadata.websiteUrl,
          content: res.pageContent,
        };
      });
      return response;
    } catch (error) {
      this.logger.error(error);

      throw new HttpException(
        {
          message: `Error while query Vector Embeddings: ${error.message}`,
          httpCode: error?.status
            ? error?.status
            : HttpStatus.INTERNAL_SERVER_ERROR,
        },
        error?.status ? error?.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
