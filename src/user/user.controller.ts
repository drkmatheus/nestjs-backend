import { Controller, Get, Param } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomParseIntPipe } from 'src/common/pipes/custom-parse-int-pipe.pipe';

@Controller('user')
export class UserController {
  constructor(private readonly configService: ConfigService) {}
  @Get(':id')
  findUserById(@Param('id', CustomParseIntPipe) id: number) {
    console.log(id, typeof id);
    console.log(this.configService.getOrThrow(''));
    return `Olá número ${id}`;
  }
}
