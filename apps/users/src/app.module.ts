import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './settings/configuration';
import { ConfigModule } from '@nestjs/config';
import { RequestContextMiddleware } from '@app/my-library/middleware/request-context.middleware';
import { AsyncLocalStorageService } from '@app/my-library/async-storage-service/async-local-storage.service';
import { LoggerModule } from '@app/my-library/logger/logger.module';

@Module({
  imports: [
    LoggerModule.forRoot('123'),
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
