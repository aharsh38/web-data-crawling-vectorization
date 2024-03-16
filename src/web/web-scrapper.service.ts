import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

@Injectable()
export class WebScrapperService {
  async scrap(url: string): Promise<string[]> {
    const dom = await this.fetchDOM(url);
    const cleanedText = this.cleanDOM(dom);
    const text = this.removeEmptySpace(cleanedText);
    const tokens = this.tokenise(text);
    return tokens;
  }

  private async fetchDOM(url: string): Promise<string> {
    try {
      const ua =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36';
      const browser = await puppeteer.launch({ ignoreHTTPSErrors: true });
      const page = await browser.newPage();
      page.setUserAgent(ua);

      // Navigate the page to a URL
      await page.goto(url);
      // console.log(await response.text());

      const dom = await page.content();
      await browser.close();
      return dom;
    } catch (err) {
      console.log(err);
      return;
    }
  }

  private cleanDOM(dom: string): string {
    const domText = cheerio.load(dom);
    domText('scripts').remove();
    domText('script').remove();
    domText('style').remove();
    domText('noscript').remove();

    const text = domText.text();

    return text;
  }

  private removeEmptySpace(text: string): string {
    return text.replace(/^\s*$(?:\r\n?|\n)/gm, '');
  }

  private tokenise(input: string): Array<string> {
    return [...new Set(input.split(' ').filter((ele) => ele !== ''))];
  }
}
