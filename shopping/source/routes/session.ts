import express from 'express';

import { UserAttributes } from '../repositories/usersRepository';
import { CartAttributes } from '../repositories/cartsRepository';

import { viewMessage } from '../views/viewMessage';

export interface Session {
  user?: UserAttributes;
  cart?: CartAttributes;
}

export const handleNoSession = (response: express.Response): void => {
  const message = 'Basic cookies are required for this website to work';
  response.send(viewMessage(message));
  return;
};
