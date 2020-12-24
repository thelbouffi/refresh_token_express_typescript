export interface IUser {
  id: string;
  email: string;
  hash: string;
  roles: string[];
}

export interface IUserResult {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}
