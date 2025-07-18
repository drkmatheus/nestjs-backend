import { Controller, Get, Param } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get(':id')
  findUserById(@Param('id') id: string) {
    return `Olá número ${id}`;
  }
}
