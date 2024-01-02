import { create2dNullArray } from './utils';
import { Cell } from './Grid';
import { Bodies, Body, IChamferableBodyDefinition } from 'matter-js';
import { width, height, wallThickness, wallColor } from './config';

enum WallType {
  horizontal = 'horizontal',
  vertical = 'vertical',
}

type WallDescriptor = [WallType, number, number];

export class Wall {
  private verticalWalls: boolean[][];
  private horizontalWalls: boolean[][];
  constructor(
    private rows: number,
    private columns: number
  ) {
    this.verticalWalls = this.initializeVerticalWalls(this.rows, this.columns);
    this.horizontalWalls = this.initializeHorizontalWalls(
      this.rows,
      this.columns
    );
  }

  createHorizontalWalls(): Body[] {
    const horizontalWalls: Body[] = [];
    this.horizontalWalls.forEach((wallRows, rowIndex) => {
      wallRows.forEach((isWall, columnIndex) => {
        if (!isWall) return;
        const wall = Bodies.rectangle(
          ((columnIndex + 0.5) * width) / this.columns,
          ((rowIndex + 1) * height) / this.rows,
          width / this.columns,
          wallThickness,
          this.getWallOptions()
        );
        horizontalWalls.push(wall);
      });
    });

    return horizontalWalls;
  }

  createVerticalWalls = (): Body[] => {
    const verticalWalls: Body[] = [];
    this.verticalWalls.forEach((wallRows, rowIndex) => {
      wallRows.forEach((isWall, columnIndex) => {
        if (!isWall) return;
        const wall = Bodies.rectangle(
          ((columnIndex + 1) * width) / this.columns,
          ((rowIndex + 0.5) * height) / this.rows,
          wallThickness,
          height / this.rows,
          this.getWallOptions()
        );
        verticalWalls.push(wall);
      });
    });

    return verticalWalls;
  };

  createBorders(): Body[] {
    return [
      Bodies.rectangle(
        width / 2,
        height * 0,
        width,
        wallThickness * 2,
        this.getWallOptions()
      ), // Top
      Bodies.rectangle(
        width / 2,
        height * 1,
        width,
        wallThickness * 2,
        this.getWallOptions()
      ), //Bottom
      Bodies.rectangle(
        width * 0,
        height / 2,
        wallThickness * 2,
        height,
        this.getWallOptions()
      ), // Left
      Bodies.rectangle(
        width * 1,
        height / 2,
        wallThickness * 2,
        height,
        this.getWallOptions()
      ), // Right
    ];
  }

  private getWallOptions(): IChamferableBodyDefinition {
    return {
      isStatic: true,
      render: {
        fillStyle: wallColor,
      },
    };
  }

  private getWallDescriptor(cell: Cell, otherCell: Cell): WallDescriptor {
    if (cell.column === otherCell.column) {
      const wallIndex = Math.min(cell.row, otherCell.row);
      return [WallType.horizontal, wallIndex, cell.column];
    }
    if (cell.row === otherCell.row) {
      const wallIndex = Math.min(cell.column, otherCell.column);
      return [WallType.vertical, cell.row, wallIndex];
    } else {
      throw new Error('Cells are not neighbors with each other');
    }
  }

  isWallBetween(cell: Cell, otherCell: Cell): boolean {
    const [wallType, row, column] = this.getWallDescriptor(cell, otherCell);
    if (wallType === WallType.horizontal) {
      return this.horizontalWalls[row][column];
    }
    if (wallType === WallType.vertical) {
      return this.verticalWalls[row][column];
    }
    throw new Error('Typescript');
  }

  setWallBetween(cell: Cell, otherCell: Cell, value: boolean): void {
    const [wallType, row, column] = this.getWallDescriptor(cell, otherCell);
    if (wallType === WallType.horizontal) {
      this.horizontalWalls[row][column] = value;
    }
    if (wallType === WallType.vertical) {
      this.verticalWalls[row][column] = value;
    }
  }

  private initializeVerticalWalls(rows: number, columns: number): boolean[][] {
    return create2dNullArray(rows, columns - 1).map((row): boolean[] => {
      return row.map((_cell): boolean => true);
    });
  }

  private initializeHorizontalWalls(
    rows: number,
    columns: number
  ): boolean[][] {
    return create2dNullArray(rows - 1, columns).map((row): boolean[] => {
      return row.map((_cell): boolean => true);
    });
  }
}
