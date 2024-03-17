import { Controller, Post, Body, Get, Query, Version } from '@nestjs/common';
import { WebService } from './web.service';
import { ScrapAnsEmbedRequestDto } from './dto/scrap-embed-request.dto';
import { QueryRequestDto } from './dto/query-request.dto';

@Controller('web')
export class WebController {
  constructor(private readonly webService: WebService) {}

  @Version('1')
  @Post('/scrapAndEmbed')
  async scrapAndEmbed(@Body() body: ScrapAnsEmbedRequestDto) {
    const tokens = await this.webService.scrapAndEmbed(body.websiteUrl);

    return {
      message: 'Processing completed',
      websiteUrl: body.websiteUrl,
      tokens,
    };
  }

  @Version('1')
  @Get()
  async fetchResult(@Query() data: QueryRequestDto) {
    const results = await this.webService.fetchResult(data.query, data.count);
    return {
      message: 'Query Processing Completed',
      results,
    };
  }
}
