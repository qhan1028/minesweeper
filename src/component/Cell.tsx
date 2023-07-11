/*
 * Created by Lin Liang-Han on 2023-7-11.
 * Copyright (c) 2023 Taiwan AI Labs.
 */

import { FC, useCallback, useContext } from "react";
import { Flag, NewReleases } from "@mui/icons-material";

import { Box } from "@mui/material";
import { Cell as CellProps } from "@/types/cell";
import { MinesweeperContext } from "@/context/MinesweeperContext";

const CellColor: { [key: number]: string } = {
  [0]: "transparent",
  [1]: "blue",
  [2]: "green",
  [3]: "red",
  [4]: "darkblue",
  [5]: "darkred",
  [6]: "darkcyan",
  [7]: "black",
  [8]: "grey",
};

export const Cell: FC<{
  cell: CellProps;
}> = ({ cell }) => {
  /** Context */
  const { reqOpenCell$, reqFlagCell$ } = useContext(MinesweeperContext);

  /** Callback */
  const handleClick = useCallback(
    () => !cell.isFlagged && reqOpenCell$.next(cell.index),
    [cell, reqOpenCell$]
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      !cell.isOpened && reqFlagCell$.next(cell.index);
    },
    [cell, reqFlagCell$]
  );

  /** Render */
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        color: cell.isFlagged
          ? "darkgrey"
          : cell.isMine
          ? cell.isOpened
            ? "red"
            : "black"
          : CellColor[cell.surroundedMines],
        backgroundColor: "lightgrey",
        borderWidth: cell.isOpened ? 1 : 2,
        borderStyle: "solid",
        borderColor: cell.isOpened
          ? "darkgrey"
          : "white darkgrey darkgrey white",
        cursor: "pointer",
        userSelect: "none",
      }}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {cell.isOpened ? (
        cell.isMine ? (
          <NewReleases sx={{ p: 0.25 }} />
        ) : (
          cell.surroundedMines
        )
      ) : null}
      {cell.isFlagged ? <Flag sx={{ p: 0.25 }} /> : null}
    </Box>
  );
};
