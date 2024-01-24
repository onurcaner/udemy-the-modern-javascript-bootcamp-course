import express, { urlencoded } from 'express';
import { EXPRESS_PORT } from './config';
import { UsersRepository } from './repositories/UsersRepository';

const app = express();
app.use(urlencoded({ extended: true }));

app.get('/', (_request, response): void => {
  console.log('>> GET');
  response.send(`
    <form method="POST">
      <input name="email" placeholder="john@gmail.com" />
      <input name="password" placeholder="password" />
      <input name="passwordConfirmation" placeholder="password confirmation" />
      <button>Sign Up</button>
    </form>
  `);
});

app.post('/', (request, response): void => {
  console.log('>> POST');
  console.log(request.body);
  response.send(`
    SUCCESS
  `);
});

app.listen(EXPRESS_PORT, () => {
  console.log(`App listening on port ${EXPRESS_PORT}`);
});

const usersRepository = new UsersRepository('users.json');

const test = async () => {
  const records = await usersRepository.filter({ password: 'new pw' });
  console.log(records);
};
