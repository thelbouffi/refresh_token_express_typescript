import { sync } from 'glob';
import { resolve } from 'path';
import '@lib/dotenv.lib';
import { Algorithm } from 'jsonwebtoken';

const config = {
  env: process.env.NODE_ENV || 'local',
  files: {
    routes: sync(resolve(__dirname, '../routes/**.routes.js')),
  },
  app: {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
  },
  session: {
    secret: process.env.SESSION_SECRET || 'someSecret',
    name: process.env.SESSION_NAME || 'sessionId',
    maxAge: process.env.MAX_AGE ? parseInt(process.env.MAX_AGE, 10) : 1000 * 60 * 30,
    secure: process.env.SECURE ? true : false,
  },
  jwt: {
    enabled: process.env.JWT_ENABLED || false,
    key: {
      type: process.env.JWT_KEY_TYPE || 'string',
      privateKey: process.env.JWT_PRIVATE_KEY || 'Some random key',
      publicKey: process.env.JWT_PUBLIC_KEY || '',
      // privateKey: (process.env.JWT_KEY_TYPE === 'file') ? readFileSync(process.env.JWT_PRIVATE_KEY as string) as Secret : process.env.JWT_PRIVATE_KEY,
      // publicKey: (process.env.JWT_KEY_TYPE === 'file') ? readFileSync(process.env.JWT_PUBLIC_KEY as string) as Secret  : process.env.JWT_PUBLIC_KEY,
      refreshToken: process.env.REFRESH_TOKEN_SECRET || 'Some random refresh token secret',
    },
    alg: process.env.JWT_ALG as Algorithm || 'HS256',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN as string | number || '2 days',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN as string | number || '1y',
  },
};

export default config;
