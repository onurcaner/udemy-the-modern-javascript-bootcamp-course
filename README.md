# The Modern Javascript Bootcamp Course

Course: [The Modern Javascript Bootcamp Course](https://www.udemy.com/course/javascript-beginners-complete-tutorial/)

Instructor: [Colt Steele](https://www.udemy.com/user/coltsteele/), [Stephen Grider](https://www.udemy.com/user/sgslo/)

Offered at: [Udemy](https://www.udemy.com/)

Notes: TypeScript is used instead of JavaScript

## Projects

### 1. Timer App

- Description: A simple timer app

- Requirements: None

- Environment: Driven by Node, displayed in browser

- Code: [This Repository / timer](./timer)

### 2. Movie Fight App

- Description: Allows users to compare two movies. Users can search for and select the movies they want to compare

- Requirements: You need to generate an [omdbapi key](https://www.omdbapi.com/apikey.aspx). Then you need to create **api-key.ts** file inside the [omdbapi folder](./movie%20fight/source/omdbapi)

```ts
// Inside omdbapi/api-key.ts
export const API_KEY = 'apikey'; // https://www.omdbapi.com/apikey.aspx
```

- Environment: Driven by Node, displayed in browser

- Code: [This Repository / movie fight](./movie%20fight)

### 3. Maze Game

- Description: Explore a cool maze game built using the Matter.js library. Navigate the player using WASD or arrow keys, and aim to reach the red square for an exciting surprise!

- Requirements: None

- Environment: Driven by Node, displayed in browser

- Code: [This Repository / maze game](./maze%20game)

### 4. Shopping App

- Description: An E-commerce app built with Node.js and Express.js. It efficiently manages three JSON databases for carts, users, and products. The app utilizes cookies to handle sessions, and the Express server responds with server-side rendered HTML documents.

- Requirements: None

- Environment: Driven by Node, UI is displayed in browser and requests are logged in terminal

- Notes: Different UI is rendered for different type of users. Please inspect usernames within the [users.json](./shopping/database/users.json). The password is _123456_ for both accounts. You can also register a new account and add isAdmin property manually.

- Code: [This Repository / shopping](./shopping)

### 5. Movie Fight App With Test

- Description: Unit testing the autocomplete widget in the Movie Fight App with Mocha and Chai

- Requirements: None

- Environment: Driven by Node, displayed in browser

- Notes: Eslint is correctly configured. The source code is completely refactored

- Code: [This Repository / movie fight with test](./movie%20fight%20with%20test)
