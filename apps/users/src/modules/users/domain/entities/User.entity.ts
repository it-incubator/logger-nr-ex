import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export class CreateUserDto {
  name: string;
  age: number;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  public name: string;

  @Column()
  public age: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  static createUser(dto: CreateUserDto) {
    const user = new User();
    user.age = dto.age;
    user.name = dto.name;

    return user;
  }
}
