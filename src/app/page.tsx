/*
 * Created by Lin Liang-Han on 2023-7-10.
 */

"use client";

import { Container } from "@mui/material";
import ErrorBoundary from "@/component/ErrorBoundary";
import { Minesweeper } from "@/component/Minesweeper";
import { ThemeProvider } from "@/theme/ThemeProvider";
import classes from "./page.module.css";

export default function Home() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Container className={classes.root}>
          <Minesweeper />
        </Container>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
