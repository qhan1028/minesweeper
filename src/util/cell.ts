/*
 * Created by Lin Liang-Han on 2023-7-11.
 * Copyright (c) 2023 Taiwan AI Labs.
 */

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
  (i: number): undefined | number[] => {
    const rc = i2rc(rows, columns)(i);
    if (!rc) return undefined;

    const [row, column] = rc;
    const square: number[] = [];

    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = column - 1; c <= column + 1; c++) {
        const i = rc2i(rows, columns)(r, c);
        if (typeof i === "number") square.push(i);
      }
    }

    return square;
  };
