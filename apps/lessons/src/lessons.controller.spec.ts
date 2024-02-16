import { Test, TestingModule } from '@nestjs/testing';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';

describe('LessonsController', () => {
  let lessonsController: LessonsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LessonsController],
      providers: [LessonsService],
    }).compile();

    lessonsController = app.get<LessonsController>(LessonsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(lessonsController.getHello()).toBe('Hello World!');
    });
  });
});
