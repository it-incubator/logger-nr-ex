import { Injectable } from '@nestjs/common';

@Injectable()
export class LessonsService {
  getHello(): string {
    return 'Hello World!';
  }
}
