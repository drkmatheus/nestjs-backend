import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString({ message: 'Senha deve ser do tipo string' })
  @IsNotEmpty({ message: 'Senha não pode estar vazia' })
  currentPassword: string;

  @IsString({ message: 'Nova senha deve ser do tipo string' })
  @IsNotEmpty({ message: 'Nova senha não pode estar vazia' })
  @MinLength(6, { message: 'Nova senha deve conter pelo menos 6 caracteres' })
  newPassword: string;
}
