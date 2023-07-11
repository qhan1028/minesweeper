/*
 * Created by Lin Liang-Han on 2023-7-11.
 * Copyright (c) 2023 Taiwan AI Labs.
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
        spacing: 8,
        components: {
          MuiButton: {
            styleOverrides: { root: { textTransform: "unset" } },
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
