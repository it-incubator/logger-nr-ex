// https://docs.nestjs.com/techniques/configuration#custom-configuration-files

enum Environments {
  DEVELOPMENT = 'DEVELOPMENT',
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION',
  TEST = 'TEST',
}

export type EnvironmentVariable = { [key: string]: string | undefined };
export type ApiSettingsType = ReturnType<typeof getConfig>['apiSettings'];

export type ConfigurationType = ReturnType<typeof getConfig>;

const getConfig = (
  environmentVariables: EnvironmentVariable,
  currentEnvironment: Environments,
) => {
  return {
    apiSettings: {
      PORT: Number.parseInt(environmentVariables.PORT || '3000'),
      LOCAL_HOST: environmentVariables.LOCAL_HOST as string,
      PUBLIC_FRIEND_FRONT_URL:
        environmentVariables.PUBLIC_FRIEND_FRONT_URL as string,
    },

    databaseSettings: {
      DB_CONNECTION_URI: environmentVariables.DB_CONNECTION_URI,
    },

    swaggerSettings: {
      SWAGGER_PATH: environmentVariables.SWAGGER_PATH as string,
    },

    loggerEnvironmentSettings: {
      HOST: environmentVariables.LOGGER_HOST,
      URL_PATH: environmentVariables.LOGGER_URL_PATH,
      LOGGER_LEVEL: environmentVariables.LOGGER_LEVEL,
    },

    environmentSettings: {
      currentEnv: currentEnvironment,
      isProduction: currentEnvironment === Environments.PRODUCTION,
      isStaging: currentEnvironment === Environments.STAGING,
      isTesting: currentEnvironment === Environments.TEST,
      isDevelopment: currentEnvironment === Environments.DEVELOPMENT,
      isNonProduction:
        currentEnvironment === Environments.STAGING ||
        currentEnvironment === Environments.TEST ||
        currentEnvironment === Environments.DEVELOPMENT,
      isNonTesting:
        currentEnvironment === Environments.STAGING ||
        currentEnvironment === Environments.PRODUCTION ||
        currentEnvironment === Environments.DEVELOPMENT,
    },
  };
};

export default () => {
  const environmentVariables = process.env;

  console.log('process.env.ENV =', environmentVariables.ENV);
  const currentEnvironment: Environments =
    environmentVariables.ENV as Environments;

  return getConfig(environmentVariables, currentEnvironment);
};
