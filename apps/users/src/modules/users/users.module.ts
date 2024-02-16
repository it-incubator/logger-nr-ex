import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UsersRepository } from './infra/users.repository';
import { UsersQueryRepository } from './infra/users.query-repository';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/User.entity';
import { AsyncLocalStorageService } from '@app/my-library/async-storage-service/async-local-storage.service';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([User])],
  providers: [
    CreateUserUseCase,
    UsersRepository,
    UsersQueryRepository,
    AsyncLocalStorageService,
  ],
  controllers: [UsersController],
  exports: [],
})
export class UsersModule {}
