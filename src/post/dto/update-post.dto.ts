import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePostDto extends PartialType(
  PickType(CreatePostDto, ['title', 'coverImgUrl', 'excerpt', 'content']),
) {
  @IsOptional()
  @IsBoolean({ message: 'Campo de publicar deve ser boolean' })
  published?: boolean;
}
