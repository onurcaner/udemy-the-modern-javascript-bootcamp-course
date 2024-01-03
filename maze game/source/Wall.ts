import { create2dNullArray } from './utils';
import { Cell } from './Grid';

export enum WallType {
  horizontal = 'horizontal',
  vertical = 'vertical',
  border = 'border',
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

  getHorizontalWalls(): boolean[][] {
    return this.horizontalWalls;
  }

  getVerticalWalls(): boolean[][] {
    return this.verticalWalls;
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
