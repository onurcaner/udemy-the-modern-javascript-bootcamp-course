import {
  USERS_REPOSITORY_FILE_NAME,
  SALT_BYTE_SIZE,
  SCRYPT_KEYLEN,
  HASH_AND_SALT_SEPARATOR,
} from '../config';
import { Repository, Attributes } from './Repository';
import { randomBytes, scrypt } from 'node:crypto';
import { promisify } from 'util';

export interface UserAttributes extends Attributes {
  id: number;
  email: string;
  password: string;
  isAdmin: boolean;
}

class UsersRepository extends Repository<UserAttributes> {
  async saltPassword(id: number): Promise<void> {
    const user = await this.getById(id);
    if (!user) return;
    const salt = randomBytes(SALT_BYTE_SIZE).toString('hex');
    const promisifiedScrypt = promisify(scrypt);
    const buffer = (await promisifiedScrypt(
      user.password,
      salt,
      SCRYPT_KEYLEN
    )) as Buffer;
    const hashedPassword = buffer.toString('hex');

    await this.update({
      ...user,
      password: hashedPassword + HASH_AND_SALT_SEPARATOR + salt,
    });
  }

  async isValidPassword(
    user: UserAttributes,
    password: string
  ): Promise<boolean> {
    const [hashedPassword, salt] = user.password.split(HASH_AND_SALT_SEPARATOR);
    console.log(hashedPassword, salt);
    const promisifiedScrypt = promisify(scrypt);
    const buffer = (await promisifiedScrypt(
      password,
      salt,
      SCRYPT_KEYLEN
    )) as Buffer;
    return hashedPassword === buffer.toString('hex');
  }
}

export const usersRepository = new UsersRepository(USERS_REPOSITORY_FILE_NAME);
