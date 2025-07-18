import { BadRequestException, ParseIntPipe } from '@nestjs/common';

export class CustomParseIntPipe extends ParseIntPipe {
  constructor() {
    super({
      exceptionFactory: () => {
        return new BadRequestException(
          'Parâmetro inválido, um numero é esperado',
        );
      },
    });
  }
}
