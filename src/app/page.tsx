/*
 * Created by Lin Liang-Han on 2023-7-10.
 */

"use client";

import { Container, Stack } from "@mui/material";

import ErrorBoundary from "@/component/ErrorBoundary";
import { Minesweeper } from "@/component/Minesweeper";
import { ThemeProvider } from "@/theme/ThemeProvider";

export default function Home() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Container sx={{ width: "100vw", height: "100vh" }}>
          <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ width: 1, height: 1 }}
          >
            <Minesweeper />
          </Stack>
        </Container>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
