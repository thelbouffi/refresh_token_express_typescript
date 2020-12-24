import { Router } from 'express';
import { login, refreshToken, logout, hello, me } from '../controllers/auth.controllers';
import { verify as verifyAccessTkn } from '@lib/jwt.lib';

const r = Router();

r.get('/', [hello]);
r.post('/login', [login]);
r.post('/refresh', [refreshToken]);
r.post('/logout', [logout]);
r.get('/current-user', [verifyAccessTkn, me]);

export const route = {
  r,
  prefix: '/auth',
};