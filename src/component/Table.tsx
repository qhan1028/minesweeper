/*
 * Created by Lin Liang-Han on 2023-7-11.
 * Copyright (c) 2023 Taiwan AI Labs.
 */

import { Box } from "@mui/material";
import { Cell } from "@/component/Cell";
import { Cell as CellProps } from "@/types/cell";
import { FC } from "react";

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
        <>
          {row.map((cell, c) => (
            <Cell key={`${r}-${c}`} cell={cell} />
          ))}
        </>
      ))}
    </Box>
  );
};
