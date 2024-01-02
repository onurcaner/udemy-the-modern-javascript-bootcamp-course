import { create2dNullArray } from './utils';

export interface Cell {
  row: number;
  column: number;
  isVisited: boolean;
}

export class Grid {
  private grid: Cell[][];
  constructor(
    private rows: number,
    private columns: number
  ) {
    this.grid = this.createGrid(this.rows, this.columns);
  }

  getGrid(): Cell[][] {
    return this.grid;
  }

  getCell(row: number, column: number): Cell | undefined {
    try {
      return this.grid[row][column];
    } catch (_err) {
      return undefined;
    }
  }

  getNeighbourCells(cell: Cell): Cell[] {
    const { row, column } = cell;

    const neighbourCells: Cell[] = [];
    [-1, 1].forEach((dif) => {
      const rowCell = this.getCell(row + dif, column);
      const columnCell = this.getCell(row, column + dif);
      if (rowCell) neighbourCells.push(rowCell);
      if (columnCell) neighbourCells.push(columnCell);
    });

    return neighbourCells;
  }

  private createGrid(rows: number, columns: number): Cell[][] {
    return create2dNullArray(rows, columns).map((row, rowIndex): Cell[] => {
      return row.map((_cell, columnIndex): Cell => {
        return {
          row: rowIndex,
          column: columnIndex,
          isVisited: false,
        };
      });
    });
  }
}
