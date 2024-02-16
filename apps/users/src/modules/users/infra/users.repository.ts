import { Injectable } from '@nestjs/common';
import { User } from '../domain/entities/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}
  async findById(id: string): Promise<User | null> {
    const user = await this.repository.findOneBy({ id });

    if (!user) return null;

    return user;
  }

  async save(userEntity: User) {
    const user = await this.repository.save(userEntity);

    return user.id;
  }
}
