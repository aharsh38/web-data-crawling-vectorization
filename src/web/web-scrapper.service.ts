import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { stopwords } from './constants';

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
      const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        args: [
          `--no-sandbox`,
          `--headless`,
          `--disable-gpu`,
          `--disable-dev-shm-usage`,
        ],
      });
      const page = await browser.newPage();

      const ua =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36';
      page.setUserAgent(ua);

      await page.goto(url);
      const dom = await page.content();

      await browser.close();
      return dom;
    } catch (err) {
      throw new HttpException(
        {
          message: `Error while scraping dom: ${err.message}`,
          httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private cleanDOM(dom: string): string {
    try {
      const domText = cheerio.load(dom);
      domText('scripts').remove();
      domText('script').remove();
      domText('style').remove();
      domText('noscript').remove();

      const text = domText.text();

      return text;
    } catch (err) {
      throw new HttpException(
        {
          message: `Error while cleaning dom: ${err.message}`,
          httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private removeEmptySpace(text: string): string {
    const regex = /[\n\t!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~™®©]/g;
    return text.replace(regex, '');
  }

  private tokenise(input: string): Array<string> {
    return [
      ...new Set(
        input
          .split(' ')
          .filter((ele) => ele !== '')
          .filter((ele) => !stopwords.includes(ele)),
      ),
    ];
  }
}
