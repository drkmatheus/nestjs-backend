import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomParseIntPipe } from 'src/common/pipes/custom-parse-int-pipe.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { strategies } from 'passport';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findUserById(@Param('id', CustomParseIntPipe) id: number) {
    return `Olá número ${id}`;
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
}
