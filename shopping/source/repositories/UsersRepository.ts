import { Repository, Attributes } from './Repository';

export interface UserAttributes extends Attributes {
  id: number;
  email: string;
  password: string;
}

export class UsersRepository extends Repository<UserAttributes> {}
