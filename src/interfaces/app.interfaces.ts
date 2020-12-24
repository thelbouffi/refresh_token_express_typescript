import { Request, Router } from 'express';

export interface IDeferred {
  key: string;
  uri: string;
}

export interface IRequest extends Request {
  meta?: any;
  user?: any;
}

export interface IRoute {
  r: Router;
  prefix: string;
}

export interface IAppConfig {
  files: {
    routes: string[];
  };
  env: string;
  app: {
    host: string;
    port: number;
  };
}
