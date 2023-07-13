/*
 * Created by Lin Liang-Han on 2023-7-11.
 */

import { Cell } from "@/types/cell";

export const i2rc =
  (rows: number, columns: number) =>
  (i: number): [number, number] | undefined => {
    if (i >= rows * columns) return undefined;

    const row = Math.floor(i / columns);
    const column = i % columns;

    return [row, column];
  };

export const rc2i =
  (rows: number, columns: number) =>
  (row: number, column: number): number | undefined => {
    if (row < 0 || row >= rows || column < 0 || column >= columns)
      return undefined;

    return columns * row + column;
  };

export const i2square =
  (rows: number, columns: number) =>
  (i: number): number[] => {
    const rc = i2rc(rows, columns)(i);
    if (!rc) return [];

    const [row, column] = rc;
    const square: number[] = [];

    rc2square(rows, columns)(row, column).map(([r, c]) => {
      const i = rc2i(rows, columns)(r, c);
      if (typeof i === "number") square.push(i);
    });

    return square;
  };

export const rc2square =
  (rows: number, columns: number) =>
  (row: number, column: number): [number, number][] => {
    const square: [number, number][] = [];

    for (
      let r = Math.max(0, row - 1);
      r <= Math.min(rows - 1, row + 1);
      r += 1
    ) {
      for (
        let c = Math.max(0, column - 1);
        c <= Math.min(columns - 1, column + 1);
        c += 1
      ) {
        square.push([r, c]);
      }
    }

    return square;
  };

export const initTable = (rows: number, columns: number): Cell[][] =>
  new Array(rows).fill(0).map((_, row) =>
    new Array(columns).fill(0).map((_, column) => ({
      row,
      column,
      surroundingMines: 0,
      surroundingFlags: 0,
    }))
  );

export const openCell = (table: Cell[][], row: number, column: number) => {
  const rows = table.length;
  const columns = rows ? table[0].length : 0;

  // Out of boundary
  if (row < 0 || column < 0 || row >= rows || column >= columns) return table;

  // Get cell
  const cell = table[row][column];

  // Already visited
  if (cell.isOpened) return table;
  cell.isOpened = true;

  // Unflag cell
  if (cell.isFlagged) flagCell(table, row, column);

  // Bump into mine
  if (cell.isMine) return table;

  // No surrounding mines
  if (cell.surroundingMines === 0) {
    rc2square(rows, columns)(row, column).map(([r, c]) =>
      openCell(table, r, c)
    );
  }

  return table;
};

export const openSquare = (table: Cell[][], row: number, column: number) => {
  const rows = table.length;
  const columns = rows ? table[0].length : 0;

  // Out of boundary
  if (row < 0 || column < 0 || row >= rows || column >= columns) return table;

  rc2square(rows, columns)(row, column).map(([r, c]) => {
    if (!table[r][c].isFlagged) openCell(table, r, c);
  });

  return table;
};

export const flagCell = (table: Cell[][], row: number, column: number) => {
  const rows = table.length;
  const columns = rows ? table[0].length : 0;

  // Out of boundary
  if (row < 0 || column < 0 || row >= rows || column >= columns) return table;

  // Get cell
  const cell = table[row][column];

  // Clear flag if is opened
  if (cell.isOpened && !cell.isFlagged) return table;

  cell.isFlagged = !cell.isFlagged;

  rc2square(rows, columns)(row, column).map(([r, c]) => {
    if (r === row && c === column) return;
    table[r][c].surroundingFlags += cell.isFlagged ? 1 : -1;
  });

  return table;
};
