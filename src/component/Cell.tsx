/*
 * Created by Lin Liang-Han on 2023-7-11.
 */

import { FC, useCallback, useContext } from "react";
import { Flag, NewReleases } from "@mui/icons-material";

import { Box } from "@mui/material";
import { Cell as CellProps } from "@/types/cell";
import { MinesweeperContext } from "@/context/MinesweeperContext";
import { State } from "@/types/state";
import classes from "./Cell.module.css";
import { useObservable } from "react-use";

const CellColor: { [key: number]: string } = {
  [0]: "transparent",
  [1]: "blue",
  [2]: "green",
  [3]: "red",
  [4]: "darkblue",
  [5]: "darkred",
  [6]: "darkcyan",
  [7]: "black",
  [8]: "gray",
};

export const Cell: FC<{
  cell: CellProps;
}> = ({ cell }) => {
  /** Context */
  const { state$, reqOpenCell$, reqOpenSquare$, reqFlagCell$, reqShowMines$ } =
    useContext(MinesweeperContext);
  const state = useObservable(state$);
  const showMines = useObservable(reqShowMines$, false);

  /** Callback */
  const handleClick = useCallback(
    () => !cell.isFlagged && reqOpenCell$.next([cell.row, cell.column]),
    [cell, reqOpenCell$]
  );

  const handleDoubleClick = useCallback(
    () =>
      cell.isOpened &&
      cell.surroundingFlags === cell.surroundingMines &&
      reqOpenSquare$.next([cell.row, cell.column]),
    [cell, reqOpenSquare$]
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      !cell.isOpened && reqFlagCell$.next([cell.row, cell.column]);
    },
    [cell, reqFlagCell$]
  );

  /** Render */
  return (
    <Box
      className={classes.root}
      sx={{
        color: cell.isFlagged
          ? "gray"
          : cell.isMine
          ? "black"
          : CellColor[cell.surroundingMines],
        backgroundColor: cell.isOpened && cell.isMine ? "red" : "lightgrey",
        borderWidth: cell.isOpened ? 1 : 2.5,
        borderColor: cell.isOpened
          ? "darkgray"
          : "white darkgray darkgray white",
        cursor: cell.isOpened ? "default" : "pointer",
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
    >
      {cell.isFlagged ? (
        <Flag className={classes.icon} />
      ) : cell.isOpened ||
        showMines ||
        state === State.FAILED ||
        state === State.SUCCEED ? (
        cell.isMine ? (
          <NewReleases className={classes.icon} />
        ) : (
          cell.surroundingMines
        )
      ) : null}
    </Box>
  );
};
