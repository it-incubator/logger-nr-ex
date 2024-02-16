import { Module } from '@nestjs/common';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';

@Module({
  imports: [],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
