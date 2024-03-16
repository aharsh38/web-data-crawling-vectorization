import { IsNotEmpty, IsUrl } from 'class-validator';

export class ScrapAnsEmbedRequestDto {
  @IsUrl()
  @IsNotEmpty()
  websiteUrl: string;
}
