import * as crypto from 'crypto';

import { IUser } from '@interfaces/user.interfaces';

const users = [
  {
    id: '5f7211063ab30f48035a1274',
    email: 'user1@email.com',
    hash: crypto
      .pbkdf2Sync('password123-1', Buffer.from('10', 'base64'), 10000, 64, 'sha512')
      .toString('base64'),
    roles: ['ADMIN'],
  },
  {
    id: '5f7211063ab30f48035b2970',
    email: 'user2@email.com',
    hash: crypto
      .pbkdf2Sync('password123-2', Buffer.from('10', 'base64'), 10000, 64, 'sha512')
      .toString('base64'),
    roles: ['USER'],
  },
];

export async function findByEmail(email: string): Promise<IUser | undefined> {
  const user = users.find((u) => u.email === email);
  return user ? user : undefined;
}

export async function findById(id: string): Promise<IUser | undefined> {
  if (!id || !/[0-9a-f]{24}/.test(id.toString())) throw new Error('Should provid a valid ID');
  const user = users.find((u) => u.id === id);
  return user ? user : undefined;
}

export function hashPwd(pwd: string): string {
  return crypto
    .pbkdf2Sync(pwd, Buffer.from('10', 'base64'), 10000, 64, 'sha512')
    .toString('base64');
}
