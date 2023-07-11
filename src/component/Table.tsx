/*
 * Created by Lin Liang-Han on 2023-7-11.
 * Copyright (c) 2023 Taiwan AI Labs.
 */

import { Box } from "@mui/material";
import { Cell } from "@/component/Cell";
import { Cell as CellProps } from "@/types/cell";
import { FC } from "react";

export const Table: FC<{
  rows: number;
  columns: number;
  cells: CellProps[];
}> = ({ rows, columns, cells }) => {
  /** Render */
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: `repeat(${rows}, 24px)`,
        gridTemplateColumns: `repeat(${columns}, 24px)`,
      }}
    >
      {cells.map((cell, i) => (
        <Cell key={i} cell={cell} />
      ))}
    </Box>
  );
};
