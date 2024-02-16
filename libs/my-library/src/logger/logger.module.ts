import { DynamicModule, Global, Module } from '@nestjs/common';
import { CustomLogger } from './logger.service';
import { WinstonService } from './winston.service';
import { AsyncLocalStorageService } from '../async-storage-service/async-local-storage.service';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '../../../../apps/users/src/settings/configuration';

@Global()
@Module({})
export class LoggerModule {
  static forRoot(serviceName: string): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        CustomLogger,
        AsyncLocalStorageService,
        {
          provide: WinstonService,
          useFactory: (
            configService: ConfigService<ConfigurationType, true>,
          ) => {
            return new WinstonService(configService, serviceName);
          },
          inject: [ConfigService],
        },
      ],
      exports: [CustomLogger],
    };
  }
}
