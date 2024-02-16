import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './settings/configuration';
import { ConfigModule } from '@nestjs/config';
import { RequestContextMiddleware } from './common/middleware/request-context.middleware';
import { AsyncLocalStorageService } from './common/async-local-storage.service';
import { LoggerModule } from './modules/logger/logger.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'ivan',
      password: '123',
      database: 'db_1',
      autoLoadEntities: true,
      synchronize: true,
      logging: ['error'],
    }),
  ],
  controllers: [],
  providers: [AsyncLocalStorageService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestContextMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
