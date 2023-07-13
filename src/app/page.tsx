/*
 * Created by Lin Liang-Han on 2023-7-10.
 */

"use client";

import { Box } from "@mui/material";
import ErrorBoundary from "@/component/ErrorBoundary";
import { Minesweeper } from "@/component/Minesweeper";
import { ThemeProvider } from "@/theme/ThemeProvider";
import classes from "./page.module.css";

export default function Home() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Box className={classes.root}>
          <Minesweeper />
        </Box>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
