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

import { Cell } from "@/types/cell";
import { MinesweeperContext } from "@/context/MinesweeperContext";
import { Stack } from "@mui/material";
import { Table } from "@/component/Table";
import { Toolbar } from "@/component/Toolbar";
import { i2square } from "@/util/cell";

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
  const [cells, setCells] = useState<Cell[]>([]);

  /** Memo */
  const { getSquareIndices } = useMemo(
    () => ({ getSquareIndices: i2square(rows, columns) }),
    [rows, columns]
  );

  /** Callback */
  const handleReset = useCallback(() => {
    const numCells = rows * columns;
    const cellIndices = Array.from(Array(numCells).keys());

    const cells: Cell[] = cellIndices.map((i) => ({
      index: i,
      surroundedMines: 0,
    }));

    const mineIndices = cellIndices.slice().shuffle().slice(0, mineNum);
    mineIndices
      .flatMap((i) => {
        cells[i].isMine = true;
        return getSquareIndices(i);
      })
      .map((i) => {
        if (typeof i === "number") cells[i].surroundedMines += 1;
      });

    setCells(cells);
  }, [rows, columns, mineNum, getSquareIndices]);

  useEffect(handleReset, [handleReset]);

  /** Subscriptions */
  useEffect(() => {
    const subscriptions = [
      reqReset$.subscribe(handleReset),

      reqOpenCell$.subscribe((i) => {
        if (typeof i !== "number") return;

        setCells((cells) => {
          if (i >= cells.length) return cells;

          const newCells = cells.slice();
          newCells[i].isOpened = true;

          return newCells;
        });
      }),

      reqFlagCell$.subscribe((i) => {
        if (typeof i !== "number") return;

        setCells((cells) => {
          if (i >= cells.length) return cells;

          const newCells = cells.slice();
          newCells[i].isFlagged = !cells[i].isFlagged;

          return newCells;
        });
      }),
    ];

    return () => {
      subscriptions.map((s) => s.unsubscribe());
    };
  }, [handleReset, reqOpenCell$, reqReset$, reqFlagCell$]);

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
      <Table rows={rows} columns={columns} cells={cells} />
    </Stack>
  );
};
