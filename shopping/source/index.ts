import express, { urlencoded } from 'express';
import cookieSession from 'cookie-session';

import { EXPRESS_PORT } from './config';
import { routers } from './routes';

const app = express();
app.use(
  express.static('public'),
  urlencoded({ extended: true }),
  cookieSession({
    keys: ['K5JF8DW8932J0OC4VV09DA12GF7IK8A02'],
  }),
  (request, response, next) => {
    console.log(request.method, '>>', request.path);
    console.log(request.session);
    next();
  }
);

app.use(...routers);

app.listen(EXPRESS_PORT, () => {
  console.log(`App listening on port ${EXPRESS_PORT}`);
});
