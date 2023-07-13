/*
 * Created by Lin Liang-Han on 2023-7-14.
 */

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import { Config, DefaultConfig } from "@/types/config";
import { FC, useCallback, useContext, useState } from "react";

import { MinesweeperContext } from "@/context/MinesweeperContext";
import classes from "./SettingDialog.module.css";
import { parseInt } from "lodash";
import { useObservable } from "react-use";

export const SettingDialog: FC = () => {
  /** Context */
  const { reqOpenSettingDialog$, reqMessage$, config$ } =
    useContext(MinesweeperContext);
  const oldConfig = useObservable(config$, DefaultConfig);
  const { rows, columns, mines } = oldConfig;
  const open = useObservable(reqOpenSettingDialog$, false);

  /** State */
  const [newConfig, setNewConfig] = useState<Config>(oldConfig);

  /** Callback */
  const handleInput = useCallback(
    (field: keyof Config) => (e: React.FocusEvent<HTMLInputElement>) =>
      setNewConfig((config) => ({
        ...config,
        [field]: parseInt(e.target.value),
      })),
    []
  );

  const handleCancel = useCallback(() => {
    reqOpenSettingDialog$.next(false);
    setNewConfig(oldConfig);
  }, [oldConfig, reqOpenSettingDialog$]);

  const handleSave = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const { rows, columns, mines } = newConfig;
      const maxMines = rows * columns - 1;

      if (rows < 1) {
        reqMessage$.next({
          severity: "warning",
          text: "The number of rows could not smaller than 1",
        });
      } else if (rows > 25) {
        reqMessage$.next({
          severity: "warning",
          text: "The number of rows could not larger than 25",
        });
      } else if (columns < 1) {
        reqMessage$.next({
          severity: "warning",
          text: "The number of columns could not smaller than 1",
        });
      } else if (columns > 50) {
        reqMessage$.next({
          severity: "warning",
          text: "The number of columns could not larger than 50",
        });
      } else if (mines > maxMines) {
        reqMessage$.next({
          severity: "warning",
          text: `The number of mines could not larger than ${maxMines}`,
        });
      } else if (mines < 1) {
        reqMessage$.next({
          severity: "warning",
          text: `The number of mines could not smaller than 1`,
        });
      } else {
        config$.next(newConfig);
        reqOpenSettingDialog$.next(false);
      }
    },
    [config$, newConfig, reqMessage$, reqOpenSettingDialog$]
  );

  /** Render */
  return (
    <Dialog open={open}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <FormGroup sx={{ gap: 2 }}>
          <Stack className={classes.row}>
            <InputLabel className={classes.label}>Rows</InputLabel>
            <OutlinedInput
              className={classes.input}
              type="number"
              defaultValue={rows}
              onBlur={handleInput("rows")}
            />
          </Stack>
          <Stack className={classes.row}>
            <InputLabel className={classes.label}>Columns</InputLabel>
            <OutlinedInput
              className={classes.input}
              type="number"
              defaultValue={columns}
              onBlur={handleInput("columns")}
            />
          </Stack>
          <Stack className={classes.row}>
            <InputLabel className={classes.label}>Mines</InputLabel>
            <OutlinedInput
              className={classes.input}
              type="number"
              defaultValue={mines}
              onBlur={handleInput("mines")}
            />
          </Stack>
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={handleCancel}>
          Cancel
        </Button>
        <Button color="inherit" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
