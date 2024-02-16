require('newrelic');
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from './settings/configuration';
import { appSettings } from './settings/main-settings';
import { CustomLogger } from './modules/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService<ConfigurationType, true>);
  const apiSettings = configService.get('apiSettings', { infer: true });
  const environmentSettings = configService.get('environmentSettings', {
    infer: true,
  });

  await appSettings(app, apiSettings, environmentSettings.isNonProduction);

  const logger = await app.resolve(CustomLogger);

  logger.setContext('NEST_INIT');
  app.useLogger(logger);

  const PORT = apiSettings.PORT;
  await app.listen(PORT, () => {
    console.log('Server started on PORT:', PORT);
    console.log('ENV', environmentSettings.currentEnv);
  });
}
bootstrap();
