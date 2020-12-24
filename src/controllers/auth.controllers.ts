import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

import config from '@config/index';
import { IRequest } from '@interfaces/app.interfaces';
import { IUser, IUserResult } from '@interfaces/user.interfaces';

import { findByEmail, hashPwd } from '@dao/users';
import client from '@lib/redis.lib';

export function hello(_req: Request, res: Response): Response {
  return res.status(200).send('Hello from app');
}

export async function login(
  req: IRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  const { username, password } = req.body;
  let user: IUser | any;
  try {
    user = await findByEmail(username);
  } catch (error) {
    next(error);
  }

  if (!user || user.hash !== hashPwd(password))
    return res.status(401).json({
      message: 'Wrong credentials',
    });

  const result = <IUserResult>{};
  const { key, alg, accessExpiresIn, refreshExpiresIn } = config.jwt;
  try {
    result.accessToken = jwt.sign({ u: user.id }, key.privateKey, {
      algorithm: alg,
      expiresIn: accessExpiresIn,
    });
    result.refreshToken = jwt.sign({ u: user.id }, key.refreshToken, {
      algorithm: alg,
      expiresIn: refreshExpiresIn,
    });
  } catch (error) {
    next(error);
  }

  if (result.refreshToken) {
    await new Promise((resolve, reject) => {
      client.SET(user.id, result.refreshToken, 'EX', 365 * 24 * 60 * 60, (err: any, result) => {
        if (err) {
          console.error(err.message);
          return reject(err);
        }
        return resolve(result);
      });
    });
  }

  result.user = user;
  return res.json(result);
}

export async function refreshToken(
  req: IRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | void | boolean> {
  const { refreshToken } = req.body;
  const { key, alg, accessExpiresIn, refreshExpiresIn } = config.jwt;

  if (!refreshToken) {
    return res.status(400).json({
      message: 'No refresh token provided',
    });
  }

  let decoded: { u: string; };
  try {
    decoded = jwt.verify(refreshToken, config.jwt.key.refreshToken) as any;
  } catch (error) {
    return res.status(400).json({
      message: 'Unauthorized',
    });
  }

  if (!decoded || !decoded.u) {
    return res.status(400).json({
      message: 'Unauthorized',
    });
  }

  const tkn = await new Promise((resolve, reject) => {
    client.GET(decoded.u, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });

  if (refreshToken !== tkn)
    return res.status(400).json({
      message: 'Unauthorized',
    });

  const result = <IUserResult>{};
  try {
    result.accessToken = jwt.sign({ u: decoded.u }, key.privateKey, {
      algorithm: alg,
      expiresIn: accessExpiresIn,
    });
    result.refreshToken = jwt.sign({ u: decoded.u }, key.refreshToken, {
      algorithm: alg,
      expiresIn: refreshExpiresIn,
    });
  } catch (error) {
    next(error);
  }

  if (result.refreshToken) {
    client.SET(decoded.u, result.refreshToken, 'EX', 365 * 24 * 60 * 60, (err: any) => {
      if (err) {
        console.error(err.message);
        return next(err);
      }
    });
  }

  return res.json(result);
}

export async function logout(
  req: IRequest,
  res: Response,
): Promise<Response | void | boolean> {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({
      message: 'No refresh token provided',
    });
  }

  let decoded: { u: string | string[]; };
  try {
    decoded = jwt.verify(refreshToken, config.jwt.key.refreshToken) as any;
  } catch (error) {
    return res.status(400).json({
      message: 'Unauthorized',
    });
  }

  if (!decoded || !decoded.u) {
    return res.status(400).json({
      message: 'Unauthorized',
    });
  }

  await new Promise((resolve, reject) => {
    client.DEL(decoded.u, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });

  return res.sendStatus(204);
}

export async function me(req: IRequest, res: Response): Promise<Response | null> {
  const result = req.user ? req.user : null;
  return res.json(result);
}
