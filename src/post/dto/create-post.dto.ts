import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreatePostDto {
  @IsString({ message: 'Título precisa ser uma string' })
  @Length(10, 150, { message: 'Título precisa ter entre 10 e 150 caracteres' })
  title: string;

  @Length(10, 200, { message: 'Excerto precisa ter entre 10 e 200 caracteres' })
  @IsString({ message: 'Excerto precisa ser uma string' })
  excerpt: string;

  @IsString({ message: 'Conteúdo precisa ser uma string' })
  @IsNotEmpty({ message: 'Conteúdo não pode ser um campo vazio' })
  content: string;

  @IsOptional()
  @IsUrl(
    { require_tld: false },
    { message: 'A URL não pode ser um campo vazio' },
  )
  coverImgUrl?: string;
}
