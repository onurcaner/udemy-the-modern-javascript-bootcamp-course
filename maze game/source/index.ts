import { Engine, Runner, Render, Events } from 'matter-js';
import { width, height, backgroundColor } from './config';
import { Game, ForceDirection } from './Game';

//
//
// Initialize Elements
const gameElement = document.querySelector<HTMLElement>('.game');
const rowsInput = document.querySelector<HTMLInputElement>('#rows');
const columnsInput = document.querySelector<HTMLInputElement>('#columns');
const scoreElement = document.querySelector<HTMLSpanElement>('.score');

if (!gameElement) throw new Error('.game element can not be found');
if (!rowsInput || !columnsInput)
  throw new Error('Input elements can not be found');
if (!scoreElement) throw new Error('.score element can not be found');

//
//
// Initialize matter-js
const engine = Engine.create({ gravity: { x: 0, y: 0 } });
const runner = Runner.create();
const composite = engine.world;
const render = Render.create({
  engine,
  element: gameElement,
  options: {
    wireframes: false,
    background: backgroundColor,
    width,
    height,
  },
});
Render.run(render);
Runner.run(runner, engine);

//
//
// Initialize Game object
const changeScore = (value: number): void => {
  scoreElement.innerHTML = value + '';
};
const game = new Game(engine, composite, changeScore, 6, 8);

//
//
// Game Events
document.addEventListener('keydown', (e) => {
  if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
    game.applyForceToPlayerBody(ForceDirection.up);
  }
  if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
    game.applyForceToPlayerBody(ForceDirection.down);
  }
  if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
    game.applyForceToPlayerBody(ForceDirection.left);
  }
  if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
    game.applyForceToPlayerBody(ForceDirection.right);
  }
});

Events.on(game.engine, 'collisionStart', game.onCollisionHandler.bind(game));

//
//
// Dom Events
[rowsInput, columnsInput].forEach((input) => {
  input.addEventListener('input', () => {
    const rowValue = +rowsInput.value;
    const columnValue = +columnsInput.value;
    if (rowValue < 2 || columnValue < 2) return;

    game.startGame(rowValue, columnValue);
  });
});

//
//
// Start Game
game.startGame();
