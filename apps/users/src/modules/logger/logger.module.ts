import { Global, Module } from '@nestjs/common';
import { CustomLogger } from './logger.service';
import { WinstonService } from './winston.service';
import { AsyncLocalStorageService } from '../../common/async-local-storage.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [CustomLogger, WinstonService, AsyncLocalStorageService],
  exports: [CustomLogger],
})
export class LoggerModule {}
