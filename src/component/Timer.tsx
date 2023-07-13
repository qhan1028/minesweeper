/*
 * Created by Lin Liang-Han on 2023-7-14.
 */

import React, { FC, useContext, useEffect, useState } from "react";

import { Box } from "@mui/material";
import { MinesweeperContext } from "@/context/MinesweeperContext";
import { State } from "@/types/state";
import { TimeText } from "@/types/time";
import classes from "./Timer.module.css";
import { msToString } from "@/util/time";
import { useObservable } from "react-use";

const DefaultTimeText: TimeText = { hour: "00", min: "00", sec: "00" };

export const Timer: FC = () => {
  /** Context */
  const { state$ } = useContext(MinesweeperContext);
  const state = useObservable(state$);

  /** State */
  const [startTimestamp, setStartTimestamp] = useState<number>(Date.now());
  const [timerActivated, setTimerActivated] = useState<boolean>(false);
  const [timeElapsedText, setTimeElapsedText] =
    useState<TimeText>(DefaultTimeText);

  /** Timer */
  useEffect(() => {
    if (timerActivated) {
      const interval = setInterval(
        () => setTimeElapsedText(msToString(Date.now() - startTimestamp)),
        1000
      );

      return () => {
        clearInterval(interval);
      };
    }
  }, [startTimestamp, timerActivated]);

  /** Subscriptions */
  useEffect(() => {
    const subscriptions = [
      state$.subscribe((state) => {
        switch (state) {
          case State.START:
            setStartTimestamp(Date.now());
            setTimerActivated(true);
            break;

          case State.INIT:
            setTimerActivated(false);
            setTimeElapsedText(DefaultTimeText);
            break;

          case State.FAILED:
          case State.SUCCEED:
            setTimerActivated(false);
            break;
        }
      }),
    ];

    return () => {
      subscriptions.map((s) => s.unsubscribe());
    };
  }, [state$]);

  /** Render */
  return (
    <Box className={classes.root}>
      <Box className={classes["digits-background"]}>
        {timeElapsedText.hour !== "00" ? "88:" : null}88:88
      </Box>
      <Box className={classes["digits-foreground"]}>
        {timeElapsedText.hour !== "00" ? timeElapsedText.hour + ":" : null}
        {timeElapsedText.min}:{timeElapsedText.sec}
      </Box>
    </Box>
  );
};
