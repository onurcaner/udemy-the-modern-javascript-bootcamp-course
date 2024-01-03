import { Wall, WallType } from './Wall';
import { Grid, Cell } from './Grid';
import {
  Engine,
  Bodies,
  Body,
  Composite,
  IChamferableBodyDefinition,
  IEventCollision,
} from 'matter-js';
import {
  width,
  height,
  wallThickness,
  wallColor,
  playerColor,
  finishColor,
  endGameDuration,
} from './config';
import { generateRandomInt } from './utils';

export enum ForceDirection {
  up = 'up',
  down = 'down',
  left = 'left',
  right = 'right',
}

export class Game {
  wall: Wall;
  grid: Grid;
  private score = 0;
  private isEndgame = false;
  private invertFinishBlockPosition = false;
  private playerBlock = this.createPlayerBlock();
  private finishBlock = this.createFinishBlock();

  constructor(
    public engine: Engine,
    public composite: Composite,
    private changeScore: (value: number) => void,
    private rows: number,
    private columns: number
  ) {
    this.wall = new Wall(rows, columns);
    this.grid = new Grid(rows, columns);
  }

  /* Game */
  setRowsAndColumns(rows: number, columns: number): void {
    this.rows = rows;
    this.columns = columns;
  }

  startGame(rows?: number, columns?: number): void {
    if (rows && columns) this.setRowsAndColumns(rows, columns);

    this.grid = new Grid(this.rows, this.columns);
    this.wall = new Wall(this.rows, this.columns);

    this.generateMaze();
    this.drawWalls();

    this.playerBlock = this.createPlayerBlock(
      this.playerBlock.position.x,
      this.playerBlock.position.y
    );
    this.finishBlock = this.createFinishBlock();

    Composite.add(this.composite, [this.playerBlock, this.finishBlock]);
  }

  endGame(): void {
    this.setGravity(0.02);
    this.makeBodiesUnstatic();

    this.invertFinishBlockPosition = !this.invertFinishBlockPosition;
    this.score += Math.round(Math.pow(this.rows * this.columns, 0.75));
    this.changeScore(this.score);

    setTimeout(() => {
      this.isEndgame = false;
      this.setGravity(0);

      this.startGame();
    }, endGameDuration * 1000);
  }

  /* Game Events */
  onCollisionHandler(e: IEventCollision<Engine>): void {
    const areBodiesPlayerAndFinish = (bodyA: Body, bodyB: Body): boolean =>
      (bodyA.id === this.playerBlock.id && bodyB.id === this.finishBlock.id) ||
      (bodyA.id === this.finishBlock.id && bodyB.id === this.playerBlock.id);

    e.pairs.forEach(({ bodyA, bodyB }) => {
      if (!this.isEndgame && areBodiesPlayerAndFinish(bodyA, bodyB)) {
        this.isEndgame = true;
        this.endGame();
      }
    });
  }

  applyForceToPlayerBody(direction: ForceDirection): void {
    const force = this.playerBlock.mass / (this.playerBlock.speed + 10) / 10;
    if (direction === ForceDirection.up) {
      Body.applyForce(this.playerBlock, this.playerBlock.position, {
        x: 0,
        y: -force,
      });
    }
    if (direction === ForceDirection.down) {
      Body.applyForce(this.playerBlock, this.playerBlock.position, {
        x: 0,
        y: force,
      });
    }
    if (direction === ForceDirection.left) {
      Body.applyForce(this.playerBlock, this.playerBlock.position, {
        x: -force,
        y: 0,
      });
    }
    if (direction === ForceDirection.right) {
      Body.applyForce(this.playerBlock, this.playerBlock.position, {
        x: force,
        y: 0,
      });
    }
  }

  makeBodiesUnstatic() {
    this.composite.bodies.forEach((body) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      if (body.label === WallType.border) return;
      Body.setStatic(body, false);
    });
  }

  /* Grid + Wall Methods */
  generateMaze(): void {
    const visitedCellStack: Cell[] = [];
    let currentCell = this.grid.getCell(...this.grid.getMiddleCoordinates());

    for (;;) {
      // visit the cell
      if (!currentCell) return;
      currentCell.isVisited = true;
      visitedCellStack.push(currentCell);

      // check if every cell is visited
      const isAllVisited = this.grid
        .getGrid()
        .reduce((sum, row) => [...sum, ...row], [])
        .every((cell) => cell.isVisited);
      if (isAllVisited) return;

      // get neighbour cells and filter them(unvisited)
      const unvisitedNeighbourCells = this.grid
        .getNeighbourCells(currentCell)
        .filter((cell) => !cell.isVisited);

      if (unvisitedNeighbourCells.length) {
        // pick a random next neighbour cell
        const nextCell =
          unvisitedNeighbourCells[
            generateRandomInt(unvisitedNeighbourCells.length - 1)
          ];

        // remove the wall between current and next cell
        this.wall.setWallBetween(currentCell, nextCell, false);

        currentCell = nextCell;
      } else {
        visitedCellStack.pop(); // current cell
        currentCell = visitedCellStack.pop();
      }
    }
  }

  /* Wall Methods */
  createHorizontalWallBodies(): Body[] {
    const horizontalWallBodies: Body[] = [];
    this.wall.getHorizontalWalls().forEach((wallRows, rowIndex) => {
      wallRows.forEach((isWall, columnIndex) => {
        if (!isWall) return;
        const wall = Bodies.rectangle(
          ((columnIndex + 0.5) * width) / this.columns,
          ((rowIndex + 1) * height) / this.rows,
          width / this.columns,
          wallThickness,
          this.getWallBodyOptions(WallType.horizontal)
        );
        horizontalWallBodies.push(wall);
      });
    });

    return horizontalWallBodies;
  }

  createVerticalWallBodies(): Body[] {
    const verticalWallBodies: Body[] = [];
    this.wall.getVerticalWalls().forEach((wallRows, rowIndex) => {
      wallRows.forEach((isWall, columnIndex) => {
        if (!isWall) return;
        const wall = Bodies.rectangle(
          ((columnIndex + 1) * width) / this.columns,
          ((rowIndex + 0.5) * height) / this.rows,
          wallThickness,
          height / this.rows,
          this.getWallBodyOptions(WallType.vertical)
        );
        verticalWallBodies.push(wall);
      });
    });

    return verticalWallBodies;
  }

  createBorderBodies(): Body[] {
    return [
      Bodies.rectangle(
        width / 2,
        height * 0,
        width,
        wallThickness * 2,
        this.getWallBodyOptions(WallType.border)
      ), // Top
      Bodies.rectangle(
        width / 2,
        height * 1,
        width,
        wallThickness * 2,
        this.getWallBodyOptions(WallType.border)
      ), //Bottom
      Bodies.rectangle(
        width * 0,
        height / 2,
        wallThickness * 2,
        height,
        this.getWallBodyOptions(WallType.border)
      ), // Left
      Bodies.rectangle(
        width * 1,
        height / 2,
        wallThickness * 2,
        height,
        this.getWallBodyOptions(WallType.border)
      ), // Right
    ];
  }

  getWallBodyOptions(label: WallType): IChamferableBodyDefinition {
    return {
      label,
      isStatic: true,
      render: {
        fillStyle: wallColor,
      },
    };
  }

  drawWalls(): void {
    Composite.remove(this.composite, Composite.allBodies(this.composite));
    Composite.add(this.composite, this.createBorderBodies());
    Composite.add(this.composite, this.createHorizontalWallBodies());
    Composite.add(this.composite, this.createVerticalWallBodies());
  }

  /* Player and Finish Block */
  createPlayerBlock(positionX?: number, positionY?: number): Body {
    return Bodies.circle(
      positionX ?? this.calculateTopLeftPosition().x,
      positionY ?? this.calculateTopLeftPosition().y,
      this.calculatePlayerBlockRadius(),
      {
        restitution: 0.25,
        friction: 0,
        frictionStatic: 0,
        frictionAir: 0.02,
        render: {
          fillStyle: playerColor,
        },
      }
    );
  }

  createFinishBlock(): Body {
    return Bodies.rectangle(
      this.invertFinishBlockPosition
        ? this.calculateTopLeftPosition().x
        : this.calculateBottomRightPosition().x,
      this.invertFinishBlockPosition
        ? this.calculateTopLeftPosition().y
        : this.calculateBottomRightPosition().y,
      this.calculateFinishBlockDimensions().x,
      this.calculateFinishBlockDimensions().y,
      {
        isStatic: true,
        render: {
          fillStyle: finishColor,
        },
      }
    );
  }

  /* Utils */
  calculateTopLeftPosition() {
    return {
      x: width / this.columns / 2,
      y: height / this.rows / 2,
    };
  }

  calculateBottomRightPosition() {
    return {
      x: width - width / this.columns / 2,
      y: height - height / this.rows / 2,
    };
  }

  calculatePlayerBlockRadius() {
    return Math.min(width / this.columns / 4, height / this.rows / 4);
  }

  calculateFinishBlockDimensions() {
    return {
      x: width / this.columns / 2,
      y: height / this.rows / 2,
    };
  }

  setGravity(magnitude: number) {
    this.engine.gravity.x = this.invertFinishBlockPosition
      ? -magnitude
      : magnitude;
    this.engine.gravity.y = this.invertFinishBlockPosition
      ? -magnitude
      : magnitude;
  }
}
