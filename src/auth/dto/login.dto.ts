import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsNotEmpty({ message: 'Campo de senha não deve estar vazio' })
  @IsString({ message: 'Senha informada inválida' })
  password: string;
}
