import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiSettingsType, ConfigurationType } from './configuration';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { errorFormatter } from '../common/exceptions/error-formatter';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { AllExceptionsFilter } from '../common/exceptions/exceptionFilters';
import { CustomLogger } from '../modules/logger/logger.service';

const configSwagger = new DocumentBuilder()
  .setTitle('Logger')
  .setVersion('1.0')
  .build();

const getSettingsForCors = (
  apiSettings: ApiSettingsType,
  isNonProduction: boolean,
) => {
  const origin = [apiSettings.PUBLIC_FRIEND_FRONT_URL];

  if (isNonProduction) {
    origin.push('http://localhost:3000', 'http://localhost:3001');
  }

  return origin;
};

const swaggerSetup = (app: INestApplication) => {
  const configService = app.get(ConfigService<ConfigurationType, true>);
  const swaggerSettings = configService.get('swaggerSettings', { infer: true });
  const SWAGGER_PATH = swaggerSettings.SWAGGER_PATH;

  const document = SwaggerModule.createDocument(app, configSwagger);

  SwaggerModule.setup(SWAGGER_PATH, app, document);
};

const addGlobalPipeToApp = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const messages = errorFormatter(errors);

        throw new BadRequestException(messages);
      },
    }),
  );
};
const addGlobalFilterToApp = async (
  app: INestApplication,
  isNonProduction: boolean,
) => {
  const allExceptionLogger = await app.resolve(CustomLogger);

  app.useGlobalFilters(
    new AllExceptionsFilter(isNonProduction, allExceptionLogger),
  );
};

const getCorsOptions = (origin: string[]): CorsOptions => ({
  origin,
  credentials: true,
});

export const appSettings = async (
  app: INestApplication,
  apiSettings: ApiSettingsType,
  isNonProduction: boolean,
) => {
  await addGlobalFilterToApp(app, isNonProduction);
  addGlobalPipeToApp(app);
  const origin = getSettingsForCors(apiSettings, isNonProduction);

  app.enableCors(getCorsOptions(origin));

  if (isNonProduction) {
    swaggerSetup(app);
  }
};
