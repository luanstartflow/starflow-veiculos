export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  logLevel: process.env.LOG_LEVEL ?? 'info',

  kanbancwDomain: process.env.KANBANCW_DOMAIN!,
  chatwootDomain: process.env.CHATWOOT_DOMAIN!,
  chatwootDatabaseUrl: process.env.CHATWOOT_DATABASE_URL!,

  database: {
    url: process.env.DATABASE_URL!,
  },

  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },

  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  },

  upload: {
    dir: process.env.UPLOAD_DIR ?? '/app/uploads',
    maxSizeMb: 10,
  },

  cors: {
    origin: process.env.CORS_ORIGIN ?? '*',
  },
});
