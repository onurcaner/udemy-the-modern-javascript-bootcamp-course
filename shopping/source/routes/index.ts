import express from 'express';

import { adminRouters } from './admin';
import { accountRouters } from './account';

const router = express.Router();
export const routers = [...adminRouters, ...accountRouters, router];
