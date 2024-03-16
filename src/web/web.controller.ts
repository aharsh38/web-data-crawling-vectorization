import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { WebService } from './web.service';

@Controller('web')
export class WebController {
  constructor(private readonly webService: WebService) {}

  @Post('/scrapAndEmbed')
  async scrapAndEmbed(@Body('websiteUrl') websiteUrl: string) {
    return await this.webService.scrapAndEmbed(websiteUrl);
  }

  @Get()
  async fetchResult(@Query('query') query: string) {
    return await this.webService.fetchResult(query);
  }
}
