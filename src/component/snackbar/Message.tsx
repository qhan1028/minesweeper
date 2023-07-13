/*
 * Created by Lin Liang-Han on 2023-7-14.
 */

import { Alert, Snackbar } from "@mui/material";
import { FC, useCallback, useContext, useEffect, useState } from "react";

import { Message as MessageProps } from "@/types/message";
import { MinesweeperContext } from "@/context/MinesweeperContext";
import { State } from "@/types/state";

export const Message: FC = ({}) => {
  /** Context */
  const { state$, reqMessage$ } = useContext(MinesweeperContext);

  /** State */
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<MessageProps | undefined>(undefined);

  /** Callback */
  const handleClose = useCallback(() => reqMessage$.next(undefined), [reqMessage$]);

  /** Memo */
  useEffect(() => {
    const subscriptions = [
      state$.subscribe((state) => {
        switch (state) {
          case State.SUCCEED:
            reqMessage$.next({
              severity: "success",
              text: "Congratulations! You've completed the mission! 🥳",
            });
            break;

          case State.FAILED:
            reqMessage$.next({
              severity: "error",
              text: "Failed! You were killed by a bomb! 🥲",
            });
            break;

          default:
            reqMessage$.next(undefined);
        }
      }),

      reqMessage$.subscribe((message) => {
        setOpen(message !== undefined);
        if (!message) return;
        setMessage(message);
      }),
    ];

    return () => {
      subscriptions.map((s) => s.unsubscribe());
    };
  }, [reqMessage$, state$]);

  /** Render */
  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      autoHideDuration={5000}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert variant="filled" severity={message?.severity} onClose={handleClose}>
        {message?.text}
      </Alert>
    </Snackbar>
  );
};
