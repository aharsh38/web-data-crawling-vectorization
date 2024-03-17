# Web Data Crawling and Vectorization

<p>
This project aims to implement a system capable of crawling data from a provided web URL, vectorizing the crawled data, and enabling users to submit queries to retrieve and visualize relevant information. The system provides an efficient way to extract, analyze, and visualizing matching data through queries from web sources.
</p>


## Features

- <strong>Web Data Crawling:</strong> Crawls data from the provided web URL.
- <strong>Data Preprocessing:</strong> Genrates tokens by processing DOM and removing noisy data.
- <strong>Data Vectorization:</strong> Vectorizes the crawled data for analysis and querying.
- <strong>Query Submission:</strong> Enables users to submit queries to retrieve relevant information.
- <strong>Data Visualization:</strong> Generates results based on the queried data.

## Stack
Database: MongoDB Atlas Cluster with Search Index

Web Crawl: [puppeteer](https://www.npmjs.com/package/puppeteer)

Data Preprocessing and tokennisation: [cheerio](https://www.npmjs.com/package/cheerio)

Embedding Model: [Cohere](https://docs.cohere.com/reference/embed)

Other packages: [LangChain](https://www.npmjs.com/package/langchain)

___
<b>Code Structure / Framework:</b>

 - [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository
 - Web Component having WebScrapperService and VectorEmbeddingsService
 - WebScrapperService role is to crawl through the given url and do preprocessing and then generates tokens
 - VectorEmbeddingsService role is to generate vectors embeddings, save them in MongoDB and do similarity search
___


## Installation

```bash
$ npm install
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`ENV`

`PORT`

`MONGO_PROTOCOL` (mongodb+srv)

`MONGO_HOST`

`MONGO_PORT` (27017)

`MONGO_DBNAME`

`MONGO_APP_NAME`

`MONGO_USERNAME`

`MONGO_PASSWORD`

`MONGO_SEARCH_INDEX_NAME`

`MONGO_SEARCH_TEXT_KEY`

`MONGO_SEARCH_ENBEDDING_KEY`

`COHERE_API_KEY`

## MongoDB Atlas Cluster

You need to create an MongoDB Atlas cluster as a vector DB.

- Go to [Atlas MongoDB website](https://www.mongodb.com/atlas/database)
- Create a project (name of the project is `MONGO_APP_NAME`) and a database inside (name of the database is `MONGO_DBNAME`)
- <b>[YOU CAN DO THIS STEP AFTER RUNNING YOU SERVER SO, COLLECTION IS CREATED BY ORM]</b>
After configuring your cluster, you'll need to create an index on the collection field you want to search over. Switch to the `Atlas Search` tab and click `Create Search Index`. From there, make sure you select `Atlas Vector Search - JSON Editor`, then select the appropriate database and collection and paste the following into the textbox:
```javascript
{
  "mappings": {
    "fields": {
      "embedding": [
        {
          "dimensions": 1024,
          "similarity": "dotProduct",
          "type": "knnVector"
        }
      ]
    }
  }
}
```
- Whitlist your IP on which the project is going to run in Atlas 

## Cohere Setup

Cohere allows developers and enterprises to build LLM-powered applications.

We are using Embed LLM to generate our vectors embeddings, Read more about it [here](https://cohere.com/models/embed)

 - Go to [Cohere dashboard](https://dashboard.cohere.com/welcome/register) (register if not a user already)
- Generate a API key and use it in `COHERE_API_KEY`


## Build

```bash
$ npm run build
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## MongoDB Schema

<b>Collenction Name:</b> WebScrapEmbeddings

| Atrribute             | type                                                                | index |
| ----------------- | ------------------------------------------------------------------ | -----------|
| _id | ObjectId | primary index (default)|
| websiteUrl | string | |
| text | string | |
| embedding | Array<Double> | search index with dimension: 1024, similarity: dotProduct and type: knnvector|

## Deployment
 - Docker
 - DockerHub
 - AWS EC2
 
Use API Documentation to test the APIs deployed on the AWS EC2 instance using docker


## API Documentation

[Detailed API documentation](https://documenter.getpostman.com/view/21961805/2sA2xnxq55)



## Authors

- [@aharsh38](https://www.github.com/aharsh38)

