import { Engine, Runner, World, Bodies, Render } from 'matter-js';
import { width, height } from './config';
import { Grid, Cell } from './Grid';
import { Wall } from './Wall';
import { generateRandomInt } from './utils';

const engine = Engine.create();
const runner = Runner.create();
const world = engine.world;
const render = Render.create({
  engine,
  element: document.body,
  options: {
    width,
    height,
  },
});

Render.run(render);
Runner.run(runner, engine);

const rowsAndColumns: [number, number] = [15, 20];
const grid = new Grid(...rowsAndColumns);
const wall = new Wall(...rowsAndColumns);

const stepThroughCell = (cell: Cell) => {
  // enter into cell and change it into isVisited
  cell.isVisited = true;

  // check if every cell is visited
  const isAllVisited = grid
    .getGrid()
    .reduce((sum, row) => [...sum, ...row], [])
    .every((cell) => cell.isVisited);
  if (isAllVisited) return;

  // get neighbour cells and filter them(unvisited)
  const neighbourCells = grid.getNeighbourCells(cell);
  const unvisitedNeighbourCells = neighbourCells.filter(
    (cell) => !cell.isVisited
  );

  if (unvisitedNeighbourCells.length) {
    // pick a random next neighbour cell
    const random = generateRandomInt(unvisitedNeighbourCells.length - 1);
    const nextCell = unvisitedNeighbourCells[random];

    // remove the wall between current and next cell
    wall.setWallBetween(cell, nextCell, false);

    // stepThroughCell to next
    stepThroughCell(nextCell);
  } else {
    const random = generateRandomInt(neighbourCells.length - 1);
    const nextCell = neighbourCells[random];

    // stepThroughCell to next
    stepThroughCell(nextCell);
  }
};

const startingCell = grid.getCell(0, 0);
startingCell && stepThroughCell(startingCell);

/* console.log(grid.getGrid());
console.log(wall.getHorizontalWalls());
console.log(wall.getVerticalWalls()); */

World.add(world, wall.createHorizontalWalls());
World.add(world, wall.createVerticalWalls());
World.add(world, wall.createBorders());

/* World.add(world, createVerticalWalls(wall.getVerticalWalls())); */
