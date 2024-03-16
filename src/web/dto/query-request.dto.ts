import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class QueryRequestDto {
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsOptional()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsInt()
  count?: number = 3;
}
