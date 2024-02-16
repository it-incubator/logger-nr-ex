import { Controller, Get } from '@nestjs/common';
import { LessonsService } from './lessons.service';

@Controller()
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  getHello(): string {
    return this.lessonsService.getHello();
  }
}
