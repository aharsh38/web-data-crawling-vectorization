import { Injectable } from '@nestjs/common';
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
import { CohereEmbeddings } from '@langchain/cohere';
import { MongoClient } from 'mongodb';

@Injectable()
export class VectorEmbeddingsService {
  private readonly mongoUri: string = `${process.env.MONGO_PROTOCOL}://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}`;

  async createVectorEmbeddings(
    websiteUrl: string,
    tokens: string[],
  ): Promise<any> {
    const client = new MongoClient(this.mongoUri);

    const collection = client
      .db(process.env.MONGO_DBNAME)
      .collection('webscrapembeddings');

    const vectorstore = await MongoDBAtlasVectorSearch.fromTexts(
      tokens,
      [],
      new CohereEmbeddings(),
      {
        collection,
        indexName: 'default', // The name of the Atlas search index. Defaults to "default"
        textKey: 'text', // The name of the collection field containing the raw content. Defaults to "text"
        embeddingKey: 'embedding', // The name of the collection field containing the embedded text. Defaults to "embedding"
      },
    );
    await client.close();

    return vectorstore.toJSON();
  }

  async search(query: string): Promise<string[]> {
    console.log(query);
    const client = new MongoClient(this.mongoUri);

    const collection = client
      .db(process.env.MONGO_DBNAME)
      .collection('webscrapembeddings');

    const vectorStore = new MongoDBAtlasVectorSearch(new CohereEmbeddings(), {
      collection,
      indexName: 'default', // The name of the Atlas search index. Defaults to "default"
      textKey: 'text', // The name of the collection field containing the raw content. Defaults to "text"
      embeddingKey: 'embedding', // The name of the collection field containing the embedded text. Defaults to "embedding"
    });

    const resultOne = await vectorStore.similaritySearch(query, 10);
    console.log(resultOne);

    await client.close();
    return ['success'];
  }
}
