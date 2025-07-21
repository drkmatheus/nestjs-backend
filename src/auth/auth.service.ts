import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { HashingService } from 'src/common/hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwt-payload-type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}
  async doLogin(loginDto: LoginDto) {
    const existingEmail = await this.userService.findByEmail(loginDto.email);
    const error = new UnauthorizedException('Usuario ou senha inválidos');

    if (!existingEmail) {
      throw error;
    }

    const checkPassword = await this.hashingService.compare(
      loginDto.password,
      existingEmail.password,
    );

    if (!checkPassword) {
      return error;
    }

    const jwtPayload: JwtPayload = {
      sub: existingEmail.id,
      email: existingEmail.email,
    };
    const signJwt = await this.jwtService.signAsync(jwtPayload);

    existingEmail.forceLogout = false;

    await this.userService.save(existingEmail);

    return { signJwt };
  }
}
