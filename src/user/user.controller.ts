import { Controller, Get, Param } from '@nestjs/common';
import { CustomParseIntPipe } from 'src/common/pipes/custom-parse-int-pipe.pipe';

@Controller('user')
export class UserController {
  @Get(':id')
  findUserById(@Param('id', CustomParseIntPipe) id: number) {
    console.log(id, typeof id);
    return `Olá número ${id}`;
  }
}
