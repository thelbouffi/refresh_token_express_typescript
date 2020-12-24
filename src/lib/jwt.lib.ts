import * as jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { IRequest } from '@interfaces/app.interfaces';

import config from '@config/index';
import { findById } from '@dao/users';

const { jwt: jwtConfig } = config;
const { privateKey, publicKey } = jwtConfig.key;
/**
 * Module init function.
 */

export async function verify(req: IRequest, res: Response, next: NextFunction): Promise<any> {
  
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json({
      message: 'Unauthorized',
    });
  }

  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(400).json({
      message: 'Unauthorized',
    });
  }

  let decoded : string | any;
  try {
    decoded = jwt.verify(token, publicKey as jwt.Secret || privateKey as jwt.Secret);
  } catch (e) {
    return res.status(400).json({
      message: 'Unauthorized',
    });
  }

  if (!decoded || !decoded.u) {
    return res.status(400).json({
      message: 'Unauthorized',
    });
  }

  try {
    req.user = await findById(decoded.u);
  } catch (e) {
    return next(e);
  }

  return next();
}
