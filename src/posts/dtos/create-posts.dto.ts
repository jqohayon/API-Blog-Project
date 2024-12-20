import {
  IsNotEmpty,
  IsString,
  IsDate,
  MinLength,
  IsEnum,
  Matches,
  IsOptional,
  IsJSON,
  IsUrl,
  IsISO8601,
  ValidateNested,
  MaxLength,
  IsArray,
} from 'class-validator';
import { postType } from '../enums/postType.enum';
import { postStatus } from '../enums/postStatus.enum';
import { CreatePostMetaOptionsDto } from '../../meta-options/dtos/create-post-meta-options.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'This is the title for the blog post',
    example: 'This is a title.',
  })
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    enum: postType,
    description: 'Possible values: post, page, story, series.',
  })
  @IsEnum(postType)
  @IsNotEmpty()
  postType: postType;

  @ApiProperty({
    description: 'For example - my-url',
    example: 'My-blogpost',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  @MaxLength(256)
  slug: string;

  @ApiProperty({
    enum: postStatus,
    description: 'Possible values: draft, scheduled, review, published',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(postStatus)
  status: postStatus;

  @ApiPropertyOptional({
    description: 'This is the content of the post.',
    example: 'post content',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'Serialize your JSON else a validaation error be thrown',
    example:
      '{\r\n \"@context\": \"https:\/\/schema.org\",\r\n \"@type\": \"Person\"\r\n}',
  })
  @IsString()
  @IsJSON()
  schema?: string;

  @ApiPropertyOptional({
    description: 'Featured image for your blog post.',
    example: 'http://localhost.com/images/image1.jpg',
  })
  @IsUrl()
  @IsOptional()
  @MaxLength(1024)
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    description: 'The date on which the blog post is published.',
    example: '2024-03-16T07:46:32+0000',
  })
  @IsISO8601()
  @IsOptional()
  publishedOn: Date;

  @ApiPropertyOptional({
    description: 'Array of tags passed as string values',
    example: '["nestjs", "typescript"]',
  })
  @IsOptional()
  @IsArray()
  //   This signifies that for each value of the array, class validator will ensure each is a string
  @IsString({ each: true })
  @MinLength(3, { each: true })
  tags?: string[];

  @ApiPropertyOptional({
    type: 'object',
    required: false,
    items: {
      type: 'object',
      properties: {
        metaValue: {
          type: 'json',
          description: 'The metaValue is a JSON string.',
          example: '{"sidebarEnabled": true}',
        },
        value: {
          type: 'any',
          description: 'Any value that you want to save the key.',
          example: true,
        },
      },
    },
  })
  @IsOptional()
  //   Use the ValidateNested && Type for validating a nested DTO
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto | null;
}
