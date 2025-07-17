import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  doLogin() {
    return 'Hello from service!';
  }
}
