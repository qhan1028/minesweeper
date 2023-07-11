/*
 * Created by Lin Liang-Han on 2023-7-11.
 * Copyright (c) 2023 Taiwan AI Labs.
 */

import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { i2rc, i2square, openCell, rc2i, rc2square } from "@/util/table";

import { Cell } from "@/types/cell";
import { MinesweeperContext } from "@/context/MinesweeperContext";
import { Stack } from "@mui/material";
import { Table } from "@/component/Table";
import { Toolbar } from "@/component/Toolbar";
import { cloneDeep } from "lodash";

export {};

declare global {
  interface Array<T> {
    shuffle(): T[];
  }
}

Array.prototype.shuffle = function shuffle<T>(this: T[]): T[] {
  for (let i = this.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [this[i], this[j]] = [this[j], this[i]];
  }
  return this;
};

export const Minesweeper: FC<{
  rows?: number;
  columns?: number;
  mineNum?: number;
}> = ({ rows = 10, columns = 20, mineNum = 40 }) => {
  /** Context */
  const { reqReset$, reqOpenCell$, reqFlagCell$ } =
    useContext(MinesweeperContext);

  /** State */
  const [table, setTable] = useState<Cell[][]>([]);

  /** Memo */
  const {
    getSquareIndices,
    getRowColumnSquare,
    indexToRowColumn,
    rowColumnToIndex,
  } = useMemo(
    () => ({
      getSquareIndices: i2square(rows, columns),
      getRowColumnSquare: rc2square(rows, columns),
      indexToRowColumn: i2rc(rows, columns),
      rowColumnToIndex: rc2i(rows, columns),
    }),
    [rows, columns]
  );

  /** Callback */
  const handleReset = useCallback(() => {
    const numCells = rows * columns;

    const cellIndices = Array.from(Array(numCells).keys());
    const mineIndices = cellIndices.slice().shuffle().slice(0, mineNum);

    // Setup mine table
    const table: Cell[][] = new Array(rows)
      .fill(0)
      .map((_, row) =>
        new Array(columns)
          .fill(0)
          .map((_, column) => ({ row, column, surroundingMines: 0 }))
      );

    // Plant mines
    mineIndices.map((i) => {
      const rowColumn = indexToRowColumn(i);
      if (!rowColumn) return;

      const [row, column] = rowColumn;
      table[row][column].isMine = true;

      const square = getRowColumnSquare(row, column);
      square.map(([r, c]) => (table[r][c].surroundingMines += 1));
    });

    setTable(table);
  }, [rows, columns, mineNum, indexToRowColumn, getRowColumnSquare]);

  useEffect(handleReset, [handleReset]);

  /** Subscriptions */
  useEffect(() => {
    const subscriptions = [
      reqReset$.subscribe(handleReset),

      reqOpenCell$.subscribe((rc) => {
        if (!rc) return;
        const [r, c] = rc;

        if (r < 0 || c < 0 || r >= rows || c >= columns) return;
        setTable((oldTable) => openCell(cloneDeep(oldTable), r, c));
      }),

      reqFlagCell$.subscribe((rc) => {
        if (!rc) return;
        const [r, c] = rc;

        if (r < 0 || c < 0 || r >= rows || c >= columns) return;

        setTable((oldTable) => {
          const newTable = cloneDeep(oldTable);
          newTable[r][c].isFlagged = !oldTable[r][c].isFlagged;

          return newTable;
        });
      }),
    ];

    return () => {
      subscriptions.map((s) => s.unsubscribe());
    };
  }, [
    handleReset,
    reqOpenCell$,
    reqReset$,
    reqFlagCell$,
    rows,
    columns,
    indexToRowColumn,
  ]);

  /** Render */
  return (
    <Stack
      sx={{
        gap: 2,
        padding: 2,
        borderRadius: 2,
        backgroundColor: "grey",
        color: "black",
      }}
    >
      <Toolbar />
      <Table table={table} />
    </Stack>
  );
};
