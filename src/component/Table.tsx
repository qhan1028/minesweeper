/*
 * Created by Lin Liang-Han on 2023-7-11.
 */

import React, { FC } from "react";

import { Box } from "@mui/material";
import { Cell } from "@/component/Cell";
import { Cell as CellProps } from "@/types/cell";
import classes from "./Table.module.css";

export const Table: FC<{
  table: CellProps[][];
}> = ({ table }) => {
  const rows = table.length;
  const columns = rows ? table[0].length : 0;

  /** Render */
  return (
    <Box
      className={classes.root}
      sx={{
        gridTemplateRows: `repeat(${rows}, 24px)`,
        gridTemplateColumns: `repeat(${columns}, 24px)`,
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
