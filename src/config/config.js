const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    CACHE_BASE_URL: Joi.string().required().description('Cache base url'),
    LOG_BASE_URL: Joi.string().required().description('Log base url'),
    CLIENT_BASE_URL: Joi.string().description('Client base url').default('http://localhost:3000'),
    BREVO_API_KEY: Joi.string().required().description('Brevo API key'),
    BREVO_BASE_URL: Joi.string().required().description('Brevo base url'),
    GITHUB_CLIENT_ID: Joi.string().required().description('Github client id'),
    GITHUB_CLIENT_SECRET: Joi.string().required().description('Github client secret'),
    UPLOAD_PORT: Joi.number().required().description('Upload port'),
    // AWS,
    AWS_PUBLIC_KEY: Joi.string().required().description('AWS public key'),
    AWS_SECRET_KEY: Joi.string().required().description('AWS secret key'),
    // OpenAI,
    OPENAI_API_KEY: Joi.string().required().description('OpenAI API key'),
    OPENAI_ENDPOINT_URL: Joi.string().required().description('OpenAI endpoint url'),
    // GenAI
    GENAI_ALLOWED_EMAILS: Joi.string().required().description('GenAI allowed emails'),
    // ETAS
    ETAS_ENABLED: Joi.boolean().description('ETAS enabled'),
    ETAS_CLIENT_ID: Joi.string().description('ETAS client id'),
    ETAS_CLIENT_SECRET: Joi.string().description('ETAS client secret'),
    ETAS_SCOPE: Joi.string().description('ETAS scope'),
    ETAS_INSTANCE_ENDPOINT: Joi.string().description('ETAS instance endpoint'),
    // Certivity
    CERTIVITY_CLIENT_ID: Joi.string().required().description('Certivity client id'),
    CERTIVITY_CLIENT_SECRET: Joi.string().required().description('Certivity client secret'),
    STRICT_AUTH: Joi.boolean().description('Strict auth'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  strictAuth: envVars.STRICT_AUTH,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationValue: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    accessExpirationUnit: 'minutes',
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    cookieRefreshOptions: {
      // TODO: change this to true when deploy
      secure: true,
      httpOnly: true,
      sameSite: 'None',
    },
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  cacheBaseUrl: envVars.CACHE_BASE_URL,
  logBaseUrl: envVars.LOG_BASE_URL,
  client: {
    baseUrl: envVars.CLIENT_BASE_URL,
  },
  brevo: {
    apiKey: envVars.BREVO_API_KEY,
    baseUrl: envVars.BREVO_BASE_URL,
  },
  constraints: {
    model: {
      maximumAuthorizedUsers: 1000,
    },
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  },
  services: {
    upload: {
      port: envVars.UPLOAD_PORT,
    },
    log: {
      port: envVars.LOG_PORT || 9600,
    },
    cache: {
      baseUrl: 'https://cache.digitalauto.tech',
    },
  },
  openai: {
    apiKey: envVars.OPENAI_API_KEY,
    endpointUrl: envVars.OPENAI_ENDPOINT_URL,
  },
  aws: {
    publicKey: envVars.AWS_PUBLIC_KEY,
    secretKey: envVars.AWS_SECRET_KEY,
  },
  genAI: {
    allowedEmails: envVars.GENAI_ALLOWED_EMAILS.split(','),
  },
  etas: {
    enabled: envVars.ETAS_ENABLED,
    clientId: envVars.ETAS_CLIENT_ID,
    clientSecret: envVars.ETAS_CLIENT_SECRET,
    scope: envVars.ETAS_SCOPE,
    instanceEndpoint: envVars.ETAS_INSTANCE_ENDPOINT,
  },
  githubIssueSubmitUrl: 'https://api.github.com/repos/digital-auto/vehicle_signal_specification/issues',
  certivity: {
    authBaseUrl: 'https://certivity-dev.eu.auth0.com/oauth/token',
    authAudience: 'https://service-api-dev.certivity.io',
    authGrantType: 'client_credentials',
    clientId: envVars.CERTIVITY_CLIENT_ID,
    clientSecret: envVars.CERTIVITY_CLIENT_SECRET,
    regulationBaseUrl: 'https://ctvt-service-api.azurewebsites.net/api/v1/protected/regulation',
  },
};

if (config.env === 'development') {
  config.jwt.accessExpirationUnit = 'days';
}

module.exports = config;
