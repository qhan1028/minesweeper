/*
 * Created by Lin Liang-Han on 2023-7-14.
 */

import { FC, useContext } from "react";

import { Button } from "@mui/material";
import { MinesweeperContext } from "@/context/MinesweeperContext";
import { State } from "@/types/state";
import classes from "./StateEmoji.module.css";
import { useObservable } from "react-use";

export const StateEmoji: FC = () => {
  /** Context */
  const { state$ } = useContext(MinesweeperContext);
  const state = useObservable(state$);

  /** Render */
  return (
    <Button color="inherit" sx={{ fontSize: "x-large" }}>
      {state === State.INIT
        ? "😐"
        : state === State.START || state === State.PLAYING
        ? "🧐"
        : state === State.SUCCEED
        ? "😎"
        : state === State.FAILED
        ? "😵"
        : ""}
    </Button>
  );
};
