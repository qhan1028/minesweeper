/*
 * Created by Lin Liang-Han on 2023-7-11.
 */

import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  flagCell,
  i2rc,
  i2square,
  initTable,
  openCell,
  openSquare,
  rc2i,
  rc2square,
} from "@/util/table";

import { Cell } from "@/types/cell";
import { MinesweeperContext } from "@/context/MinesweeperContext";
import { Stack } from "@mui/material";
import { State } from "@/types/state";
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
  mines?: number;
}> = ({ rows = 10, columns = 20, mines = 10 }) => {
  /** Context */
  const { state$, reqReset$, reqOpenCell$, reqOpenSquare$, reqFlagCell$ } =
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
    setTable(initTable(rows, columns));
    state$.next(State.INIT);
  }, [rows, columns, state$]);

  const handleStart = useCallback(
    (initRow: number, initColumn: number) => {
      setTable((oldTable) => {
        // Prevent first picked cell to be a mine cell
        const initIndex = rowColumnToIndex(initRow, initColumn);
        const mineIndices = Array.from(Array(rows * columns).keys())
          .filter((i) => i !== initIndex)
          .shuffle()
          .slice(0, mines);

        const newTable = cloneDeep(oldTable);

        // Plant mines
        mineIndices.map(indexToRowColumn).map((rowColumn) => {
          if (!rowColumn) return;

          const [row, column] = rowColumn;
          newTable[row][column].isMine = true;

          const square = getRowColumnSquare(row, column);
          square.map(([r, c]) => (newTable[r][c].surroundingMines += 1));
        });

        // Open first cell
        openCell(newTable, initRow, initColumn);

        return newTable;
      });

      state$.next(State.PLAYING);
    },
    [
      state$,
      rowColumnToIndex,
      rows,
      columns,
      mines,
      indexToRowColumn,
      getRowColumnSquare,
    ]
  );

  /** Initialize table */
  useEffect(handleReset, [handleReset]);

  /** Check playing status */
  useEffect(() => {
    const { alive, cleared } = table.flat().reduce(
      (s, cell) => ({
        alive: s.alive && !(cell.isMine && cell.isOpened),
        cleared: s.cleared + (!cell.isMine && cell.isOpened ? 1 : 0),
      }),
      { alive: true, cleared: 0 }
    );

    if (!alive) state$.next(State.FAILED);
    else if (cleared === rows * columns - mines) state$.next(State.SUCCEED);
  }, [columns, mines, rows, state$, table]);

  /** Subscriptions */
  useEffect(() => {
    const subscriptions = [
      reqReset$.subscribe(handleReset),

      reqOpenCell$.subscribe((rc) => {
        if (!rc) return;
        const [r, c] = rc;

        state$.value === State.INIT
          ? handleStart(r, c)
          : state$.value === State.PLAYING
          ? setTable((oldTable) => openCell(cloneDeep(oldTable), r, c))
          : null;
      }),

      reqOpenSquare$.subscribe((rc) => {
        if (!rc) return;
        const [r, c] = rc;

        if (state$.value === State.PLAYING)
          setTable((oldTable) => openSquare(cloneDeep(oldTable), r, c));
      }),

      reqFlagCell$.subscribe((rc) => {
        if (!rc) return;
        const [r, c] = rc;

        if (state$.value === State.PLAYING)
          setTable((oldTable) => flagCell(cloneDeep(oldTable), r, c));
      }),
    ];

    return () => {
      subscriptions.map((s) => s.unsubscribe());
    };
  }, [
    rows,
    columns,
    handleReset,
    indexToRowColumn,
    handleStart,
    state$,
    reqOpenCell$,
    reqReset$,
    reqFlagCell$,
    reqOpenSquare$,
  ]);

  /** Render */
  return (
    <Stack
      sx={{
        gap: 2,
        padding: 2,
        borderRadius: 2,
        backgroundColor: "gray",
        color: "black",
      }}
    >
      <Toolbar />
      <Table table={table} />
    </Stack>
  );
};
