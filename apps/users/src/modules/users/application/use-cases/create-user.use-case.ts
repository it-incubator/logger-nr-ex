import { Injectable } from '@nestjs/common';
import { CreateUserDto, User } from '../../domain/entities/User.entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infra/users.repository';
import { CustomLogger } from '../../../logger/logger.service';

@Injectable()
export class CreateUserCommand {
  constructor(public readonly dto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private logger: CustomLogger,
  ) {
    logger.setContext(CreateUserUseCase.name);
  }
  execute(command: CreateUserCommand): Promise<string> {
    this.logger.debug('usecase debug');
    const user = User.createUser(command.dto);
    throw new Error('SUPER ERROR');
    return this.usersRepository.save(user);
  }
}
