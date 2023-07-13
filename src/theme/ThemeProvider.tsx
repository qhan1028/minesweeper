/*
 * Created by Lin Liang-Han on 2023-7-11.
 */

import {
  CssBaseline,
  ThemeOptions,
  ThemeProvider as ThemeProviderV5,
  createTheme as createThemeV5,
  responsiveFontSizes,
} from "@mui/material";
import { FC, HTMLAttributes, useMemo } from "react";

export const ThemeProvider: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
}) => {
  const options = useMemo(
    () =>
      ({
        palette: {
          primary: { main: "#808080" },
        },
        typography: {
          fontFamily: "roboto",
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "unset",
                fontWeight: "bold",
                minWidth: "unset",
                minHeight: "unset",
                lineHeight: 1,
                padding: 4,
                borderRadius: 0,
                borderStyle: "solid",
                borderWidth: 2.5,
                borderColor: "white darkgray darkgray white",
                "&:active": {
                  borderColor: "darkgray",
                },
                "&:disabled": {
                  background: "lightgray",
                },
              },
            },
            defaultProps: {
              disableRipple: true,
              variant: "contained",
              size: "small",
            },
          },
          MuiDialog: {
            defaultProps: { PaperProps: { sx: { borderRadius: 2 } } },
          },
          MuiDialogTitle: {
            styleOverrides: { root: { padding: 16, lineHeight: 1 } },
          },
          MuiDialogContent: { styleOverrides: { root: { padding: 24 } } },
          MuiDialogActions: { styleOverrides: { root: { padding: 16 } } },
          MuiTextField: {
            defaultProps: { size: "small" },
          },
          MuiOutlinedInput: {
            defaultProps: {
              size: "small",
              autoComplete: "off",
              autoCorrect: "off",
            },
          },
          MuiFormControl: {
            styleOverrides: { flexDirection: "row", alignItems: "baseline" },
          },
        },
      } as ThemeOptions),
    []
  );

  const theme = useMemo(
    () => responsiveFontSizes(createThemeV5(options)),
    [options]
  );

  /** Render */
  return (
    <ThemeProviderV5 theme={theme}>
      <CssBaseline />
      <link
        href="https://fonts.cdnfonts.com/css/digital-numbers"
        rel="stylesheet"
      ></link>
      {children}
    </ThemeProviderV5>
  );
};
