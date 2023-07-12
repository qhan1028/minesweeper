/*
 * Created by Lin Liang-Han on 2023-7-11.
 */

import { Box, Button, Stack } from "@mui/material";
import { FC, useCallback, useContext } from "react";
import {
  Replay as ReplayIcon,
  ResetTvOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { MinesweeperContext } from "@/context/MinesweeperContext";
import { State } from "@/types/state";
import { useObservable } from "react-use";

export const Toolbar: FC<{}> = ({}) => {
  /** Context */
  const { state$, reqReset$, reqShowMines$ } = useContext(MinesweeperContext);
  const state = useObservable(state$);
  const showMines = useObservable(reqShowMines$, false);

  /** Callback */
  const handleReset = useCallback(() => reqReset$.next(), [reqReset$]);

  const handleShowMines = useCallback(
    () => reqShowMines$.next(!reqShowMines$.value),
    [reqShowMines$]
  );

  /** Render */
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        justifyItems: "center",
      }}
    >
      <Stack direction="row" justifySelf="flex-start">
        {/* Timer */}
      </Stack>
      <Stack direction="row">
        <Button color="inherit" sx={{ fontSize: "x-large" }}>
          {state === State.INIT
            ? "😐"
            : state === State.PLAYING
            ? "🧐"
            : state === State.SUCCEED
            ? "😎"
            : state === State.FAILED
            ? "😵"
            : ""}
        </Button>
      </Stack>
      <Stack direction="row" justifySelf="flex-end">
        <Button color="inherit" onClick={handleReset}>
          <ReplayIcon />
        </Button>
        <Button color="inherit" onClick={handleShowMines}>
          {showMines ? <VisibilityOff /> : <Visibility />}
        </Button>
      </Stack>
    </Box>
  );
};
