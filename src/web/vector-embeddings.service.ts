import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
import { CohereEmbeddings } from '@langchain/cohere';
import { InjectModel } from '@nestjs/mongoose';
import { MongoClient } from 'mongodb';
import { Model } from 'mongoose';

import { WebScrapEmbeddings } from '../schemas/web.schema';

@Injectable()
export class VectorEmbeddingsService {
  private client: MongoClient;
  private readonly mongoUri: string;

  constructor(
    @InjectModel(WebScrapEmbeddings.name)
    private readonly webScrapEmbeddingsModel: Model<WebScrapEmbeddings>,
  ) {
    this.mongoUri = `${process.env.MONGO_PROTOCOL}://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}`;
    this.client = new MongoClient(this.mongoUri);
  }

  async createVectorEmbeddings(
    websiteUrl: string,
    tokens: string[],
  ): Promise<unknown> {
    try {
      const collection = this.client
        .db(process.env.MONGO_DBNAME)
        .collection('webscrapembeddings');

      const vectorstore = await MongoDBAtlasVectorSearch.fromTexts(
        tokens,
        [],
        new CohereEmbeddings(),
        {
          collection,
          indexName: 'default',
          textKey: 'text',
          embeddingKey: 'embedding',
        },
      );
      return vectorstore.toJSON();
    } catch (error) {
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

  async search(query: string, count: number): Promise<string[]> {
    try {
      const collection = this.client
        .db(process.env.MONGO_DBNAME)
        .collection('webscrapembeddings');

      const vectorStore = new MongoDBAtlasVectorSearch(new CohereEmbeddings(), {
        collection,
        indexName: 'default',
        textKey: 'text',
        embeddingKey: 'embedding',
      });

      const results = await vectorStore.similaritySearch(query, count);
      const response = results.map((res) => res.pageContent);
      return response;
    } catch (error) {
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

  async generateVectorEmbeddings(
    websiteUrl: string,
    tokens: string[],
  ): Promise<boolean> {
    // manipulating tokens size because cohere api only suports 100 calls/hr in trial version
    tokens = tokens.length > 100 ? tokens.splice(100) : tokens;

    const embeddings = new CohereEmbeddings();
    const dbInserts = await Promise.all(
      tokens.map(async (token) => {
        const res = await embeddings.embedQuery(token);
        return {
          insertOne: {
            document: {
              websiteUrl,
              text: token,
              embedding: res,
            },
          },
        };
      }),
    );
    const res = await this.webScrapEmbeddingsModel.bulkWrite(dbInserts);
    return Boolean(res.ok);
  }
}
