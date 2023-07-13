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
import { useLifecycles, useObservable } from "react-use";

import { Cell } from "@/types/cell";
import { DefaultConfig } from "@/types/config";
import { Message } from "@/component/snackbar/Message";
import { MinesweeperContext } from "@/context/MinesweeperContext";
import { SettingDialog } from "@/component/dialog/SettingDialog";
import { Stack } from "@mui/material";
import { State } from "@/types/state";
import { Table } from "@/component/Table";
import { Toolbar } from "@/component/Toolbar";
import classes from "./Minesweeper.module.css";
import { cloneDeep } from "lodash";

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

export const Minesweeper: FC = () => {
  /** Context */
  const {
    state$,
    config$,
    reqReset$,
    reqOpenCell$,
    reqOpenSquare$,
    reqFlagCell$,
  } = useContext(MinesweeperContext);
  const { rows, columns, mines } = useObservable(config$, DefaultConfig);

  useEffect(() => {
    console.info(rows, columns, mines);
  }, [columns, mines, rows]);

  /** State */
  const [table, setTable] = useState<Cell[][]>([]);

  /** Lifecycle */
  useLifecycles(
    () => handleReset(),
    () => {
      state$.next(State.INIT);
      reqOpenCell$.next(undefined);
      reqOpenSquare$.next(undefined);
      reqFlagCell$.next(undefined);
    }
  );

  /** Memo */
  const { getRowColumnSquare, indexToRowColumn, rowColumnToIndex } = useMemo(
    () => ({
      indexToRowColumn: i2rc(rows, columns),
      rowColumnToIndex: rc2i(rows, columns),
      getSquareIndices: i2square(rows, columns),
      getRowColumnSquare: rc2square(rows, columns),
    }),
    [columns, rows]
  );

  /** Callback */
  const handleReset = useCallback(() => {
    state$.next(State.INIT);
    reqOpenCell$.next(undefined);
    reqOpenSquare$.next(undefined);
    reqFlagCell$.next(undefined);

    setTable(initTable(rows, columns));
  }, [state$, reqOpenCell$, reqOpenSquare$, reqFlagCell$, rows, columns]);

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

      state$.next(State.START);
    },
    [
      rows,
      columns,
      mines,
      state$,
      rowColumnToIndex,
      indexToRowColumn,
      getRowColumnSquare,
    ]
  );

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
      reqReset$.subscribe(() => handleReset()),

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

      state$.subscribe(
        (state) => state === State.START && state$.next(State.PLAYING)
      ),

      config$.subscribe(() => handleReset()),
    ];

    return () => {
      subscriptions.map((s) => s.unsubscribe());
    };
  }, [
    indexToRowColumn,
    handleReset,
    handleStart,
    state$,
    reqOpenCell$,
    reqReset$,
    reqFlagCell$,
    reqOpenSquare$,
    config$,
  ]);

  /** Render */
  return (
    <>
      <Stack className={classes.root}>
        <Toolbar />
        <Table table={table} />
      </Stack>

      <SettingDialog />
      <Message />
    </>
  );
};
