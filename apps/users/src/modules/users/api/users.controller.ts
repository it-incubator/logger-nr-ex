import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/use-cases/create-user.use-case';
import { IsNumber, IsString } from 'class-validator';
import { CustomLogger } from '../../logger/logger.service';

class CreateUserInputDto {
  @IsString()
  name: string;
  @IsNumber()
  age: number;
}

@Controller()
export class UsersController {
  constructor(
    private commandBus: CommandBus,
    private logger: CustomLogger,
  ) {
    this.logger.setContext(UsersController.name);
  }

  @Post()
  createUser(@Body() dto: CreateUserInputDto) {
    this.logger.log('log message', UsersController.prototype.createUser.name);

    return this.commandBus.execute(new CreateUserCommand(dto));
  }
}
