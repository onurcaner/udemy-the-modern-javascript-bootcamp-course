import {
  Engine,
  Runner,
  Composite,
  Bodies,
  Render,
  ICollisionFilter,
} from 'matter-js';
import {
  width,
  height,
  backgroundColor,
  finishColor,
  startColor,
  playerColor,
} from './config';
import { Grid, Cell } from './Grid';
import { Wall } from './Wall';
import { generateRandomInt } from './utils';

// Initialize matter-js
const engine = Engine.create();
const runner = Runner.create();
const composite = engine.world;
const render = Render.create({
  engine,
  element: document.body,
  options: {
    wireframes: false,
    width,
    height,
    background: backgroundColor,
  },
});
Render.run(render);
Runner.run(runner, engine);

// Initialize Grid and Wall models
const rows = 6;
const columns = 8;
const grid = new Grid(rows, columns);
const wall = new Wall(rows, columns);

const drawWalls = (composite: Composite, wall: Wall): void => {
  /* Composite.remove(composite, Composite.allBodies(composite)); */
  Composite.add(composite, wall.createHorizontalWalls());
  Composite.add(composite, wall.createVerticalWalls());
  Composite.add(composite, wall.createBorders());
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

generateMaze(grid, wall);
drawWalls(composite, wall);

const startBlock = Bodies.rectangle(
  width / columns / 2,
  height / rows / 2,
  width / columns / 2,
  height / rows / 2,
  {
    isStatic: true,
    render: {
      fillStyle: startColor,
    },
  }
);
Composite.add(composite, startBlock);

const finishBlock = Bodies.rectangle(
  width - width / columns / 2,
  height - height / rows / 2,
  width / columns / 2,
  height / rows / 2,
  {
    isStatic: true,
    render: {
      fillStyle: finishColor,
    },
  }
);
Composite.add(composite, finishBlock);

const playerBlock = Bodies.circle(
  width / columns / 2,
  height / rows / 2,
  width / columns / 4,
  {
    render: {
      fillStyle: playerColor,
    },
  }
);
Composite.add(composite, playerBlock);
