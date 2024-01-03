import {
  Engine,
  Runner,
  Composite,
  Render,
  Bodies,
  Body,
  Events,
} from 'matter-js';
import {
  width,
  height,
  backgroundColor,
  finishColor,
  playerColor,
} from './config';
import { Grid, Cell } from './Grid';
import { Wall, WallType } from './Wall';
import { generateRandomInt } from './utils';

// Initialize matter-js
const gameElement = document.querySelector<HTMLElement>('.game');
if (!gameElement) throw new Error('.game element can not be found');
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

// Initialize Game Data
let rows = 6;
let columns = 8;
let invert = false;
let score = 0;
let isWinnable = true;
let playerBlock: Body;
let finishBlock: Body;

// Game Functions
const topLeftPosition = () => ({
  x: width / columns / 2,
  y: height / rows / 2,
});

const bottomRightPosition = () => ({
  x: width - width / columns / 2,
  y: height - height / rows / 2,
});

const playerBlockSize = () => Math.min(width / columns / 4, height / rows / 4);

const finishBlockSize = () => ({
  x: width / columns / 2,
  y: height / rows / 2,
});

const createPlayerBlock = (positionX?: number, positionY?: number): Body =>
  Bodies.circle(
    positionX ?? topLeftPosition().x,
    positionY ?? topLeftPosition().y,
    playerBlockSize(),
    {
      restitution: 0.2,
      render: {
        fillStyle: playerColor,
      },
    }
  );

const createFinishBlock = (invert: boolean): Body =>
  Bodies.rectangle(
    invert ? topLeftPosition().x : bottomRightPosition().x,
    invert ? topLeftPosition().y : bottomRightPosition().y,
    finishBlockSize().x,
    finishBlockSize().y,
    {
      isStatic: true,
      render: {
        fillStyle: finishColor,
      },
    }
  );

const drawWalls = (composite: Composite, wall: Wall): void => {
  Composite.remove(composite, Composite.allBodies(composite));
  Composite.add(composite, wall.createBorders());
  Composite.add(composite, wall.createHorizontalWalls());
  Composite.add(composite, wall.createVerticalWalls());
};

const generateMaze = (grid: Grid, wall: Wall) => {
  const visitedCellStack: Cell[] = [];
  let currentCell = grid.getCell(...grid.getMiddleCoordinates());

  for (;;) {
    // visit the cell
    if (!currentCell) return;
    currentCell.isVisited = true;
    visitedCellStack.push(currentCell);

    // check if every cell is visited
    const isAllVisited = grid
      .getGrid()
      .reduce((sum, row) => [...sum, ...row], [])
      .every((cell) => cell.isVisited);
    if (isAllVisited) return;

    // get neighbour cells and filter them(unvisited)
    const unvisitedNeighbourCells = grid
      .getNeighbourCells(currentCell)
      .filter((cell) => !cell.isVisited);

    if (unvisitedNeighbourCells.length) {
      // pick a random next neighbour cell
      const nextCell =
        unvisitedNeighbourCells[
          generateRandomInt(unvisitedNeighbourCells.length - 1)
        ];

      // remove the wall between current and next cell
      wall.setWallBetween(currentCell, nextCell, false);

      currentCell = nextCell;
    } else {
      visitedCellStack.pop(); // current cell
      currentCell = visitedCellStack.pop();
    }
  }
};

const restartGame = (rows: number, columns: number, invert = false): void => {
  const grid = new Grid(rows, columns);
  const wall = new Wall(rows, columns);

  generateMaze(grid, wall);
  drawWalls(composite, wall);

  playerBlock = createPlayerBlock(
    playerBlock.position.x,
    playerBlock.position.y
  );
  finishBlock = createFinishBlock(invert);
  Composite.add(composite, [playerBlock, finishBlock]);

  const scoreElement = document.querySelector<HTMLElement>('.score');
  if (scoreElement) scoreElement.innerHTML = score + '';
};

const letItFall = (): void => {
  composite.bodies.forEach((body) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (body.label === WallType.border) return;
    Body.setStatic(body, false);
  });
};

// Game Events
document.addEventListener('keydown', (e) => {
  const force =
    playerBlock.area /
    ((playerBlock.speed / playerBlock.area) * 100 + 50) /
    5000;
  console.log(playerBlock.speed);
  if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
    Body.applyForce(playerBlock, playerBlock.position, { x: 0, y: -force });
  }
  if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
    Body.applyForce(playerBlock, playerBlock.position, { x: 0, y: force });
  }
  if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
    Body.applyForce(playerBlock, playerBlock.position, { x: -force, y: 0 });
  }
  if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
    Body.applyForce(playerBlock, playerBlock.position, { x: force, y: 0 });
  }
});

Events.on(engine, 'collisionStart', (e) => {
  e.pairs.forEach(({ bodyA, bodyB }) => {
    if (
      (bodyA.id === playerBlock.id && bodyB.id === finishBlock.id) ||
      (bodyA.id === finishBlock.id && bodyB.id === playerBlock.id)
    ) {
      if (isWinnable) {
        isWinnable = false;
        invert = !invert;
        score += rows * columns;
        engine.gravity.x = invert ? 0.1 : -0.1;
        engine.gravity.y = invert ? 0.1 : -0.1;
        letItFall();
        setTimeout(() => {
          engine.gravity.x = 0;
          engine.gravity.y = 0;
          restartGame(rows, columns, invert);
          isWinnable = true;
        }, 5000);
      }
    }
  });
});

// Input Events
const rowsInput = document.querySelector<HTMLInputElement>('#rows');
const columnsInput = document.querySelector<HTMLInputElement>('#columns');
if (!rowsInput || !columnsInput) throw new Error('Can not find input elements');

[rowsInput, columnsInput].forEach((input) => {
  input.addEventListener('input', () => {
    const rowValue = +rowsInput.value;
    const columnValue = +columnsInput.value;
    if (rowValue < 2 || columnValue < 2) return;

    rows = rowValue;
    columns = columnValue;
    restartGame(rows, columns, invert);
  });
});

// Start Game
playerBlock = createPlayerBlock();
finishBlock = createFinishBlock(invert);
restartGame(rows, columns, invert);
