/*
 * Created by Lin Liang-Han on 2023-7-11.
 */

import React, { FC } from "react";

import { Box } from "@mui/material";
import { Cell } from "@/component/Cell";
import { Cell as CellProps } from "@/types/cell";

export const Table: FC<{
  table: CellProps[][];
}> = ({ table }) => {
  /** Render */
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: `repeat(${table.length}, 24px)`,
        gridTemplateColumns: `repeat(${
          table.length ? table[0].length : 0
        }, 24px)`,
      }}
    >
      {table.map((row, r) => (
        <React.Fragment key={r}>
          {row.map((cell, c) => (
            <Cell key={c} cell={cell} />
          ))}
        </React.Fragment>
      ))}
    </Box>
  );
};
