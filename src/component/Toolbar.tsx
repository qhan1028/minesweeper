/*
 * Created by Lin Liang-Han on 2023-7-11.
 * Copyright (c) 2023 Taiwan AI Labs.
 */

import { Button, Stack } from "@mui/material";
import { FC, useCallback, useContext } from "react";

import { MinesweeperContext } from "@/context/MinesweeperContext";
import { useObservable } from "react-use";

export const Toolbar: FC<{}> = ({}) => {
  /** Context */
  const { reqReset$, reqShowMines$ } = useContext(MinesweeperContext);
  const showMines = useObservable(reqShowMines$, false);

  /** Callback */
  const handleReset = useCallback(() => reqReset$.next(), [reqReset$]);

  const handleShowMines = useCallback(
    () => reqShowMines$.next(!reqShowMines$.value),
    [reqShowMines$]
  );

  /** Render */
  return (
    <Stack direction="row" sx={{ gap: 2 }}>
      <Button variant="contained" color="inherit" onClick={handleReset}>
        Reset
      </Button>
      <Button variant="contained" color="inherit" onClick={handleShowMines}>
        {showMines ? "Hide" : "Show"}
      </Button>
    </Stack>
  );
};
