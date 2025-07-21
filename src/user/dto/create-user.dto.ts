import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Nome deve ser do tipo string' })
  @IsNotEmpty({ message: 'Nome não pode estar vazio' })
  name: string;
  @IsEmail({}, { message: 'Email inválido' })
  email: string;
  @IsString({ message: 'Senha deve ser do tipo string' })
  @IsNotEmpty({ message: 'Senha não pode estar vazia' })
  @MinLength(6, { message: 'Senha deve conter pelo menos 6 caracteres' })
  password: string;
}
