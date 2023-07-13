/*
 * Created by Lin Liang-Han on 2023-7-11.
 */

import { Box, Button, Stack } from "@mui/material";
import { FC, useCallback, useContext } from "react";
import {
  Replay as ReplayIcon,
  Settings,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { MinesweeperContext } from "@/context/MinesweeperContext";
import { State } from "@/types/state";
import { StateEmoji } from "@/component/StateEmoji";
import { Timer } from "@/component/Timer";
import classes from "./Toolbar.module.css";
import { useObservable } from "react-use";

export const Toolbar: FC<{}> = ({}) => {
  /** Context */
  const { state$, reqReset$, reqShowMines$, reqOpenSettingDialog$ } =
    useContext(MinesweeperContext);
  const state = useObservable(state$);
  const showMines = useObservable(reqShowMines$, false);

  /** Callback */
  const handleReset = useCallback(() => reqReset$.next(), [reqReset$]);

  const handleShowMines = useCallback(
    () => reqShowMines$.next(!reqShowMines$.value),
    [reqShowMines$]
  );

  const handleOpenSetting = useCallback(
    () => reqOpenSettingDialog$.next(true),
    [reqOpenSettingDialog$]
  );

  /** Render */
  return (
    <Box className={classes.root}>
      <Stack className={classes.left}>
        <Timer />
      </Stack>
      <Stack className={classes.center}>
        <StateEmoji />
      </Stack>
      <Stack className={classes.right}>
        <Button color="inherit" onClick={handleReset}>
          <ReplayIcon />
        </Button>
        <Button color="inherit" onClick={handleShowMines}>
          {showMines ? <VisibilityOff /> : <Visibility />}
        </Button>
        <Button
          color="inherit"
          disabled={state !== State.INIT}
          onClick={handleOpenSetting}
        >
          <Settings />
        </Button>
      </Stack>
    </Box>
  );
};
