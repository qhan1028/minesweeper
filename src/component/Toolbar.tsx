/*
 * Created by Lin Liang-Han on 2023-7-11.
 * Copyright (c) 2023 Taiwan AI Labs.
 */

import { Button, Stack } from "@mui/material";
import { FC, useCallback, useContext } from "react";

import { MinesweeperContext } from "@/context/MinesweeperContext";

export const Toolbar: FC<{}> = ({}) => {
  /** Context */
  const { reqReset$ } = useContext(MinesweeperContext);

  /** Callback */
  const handleReset = useCallback(() => reqReset$.next(), [reqReset$]);

  /** Render */
  return (
    <Stack direction="column">
      <Button variant="contained" color="inherit" onClick={handleReset}>
        Reset
      </Button>
    </Stack>
  );
};
