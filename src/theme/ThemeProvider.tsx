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
        typography: {
          fontFamily: "monospace",
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
              },
            },
            defaultProps: {
              disableRipple: true,
              variant: "contained",
              size: "small",
            },
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
      {children}
    </ThemeProviderV5>
  );
};
