import { UserAttributes } from '../repositories/UsersRepository';

export interface UserSession {
  user?: UserAttributes;
}
