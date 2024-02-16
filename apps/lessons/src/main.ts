import { NestFactory } from '@nestjs/core';
import { LessonsModule } from './lessons.module';

async function bootstrap() {
  const app = await NestFactory.create(LessonsModule);
  await app.listen(3000);
}
bootstrap();
