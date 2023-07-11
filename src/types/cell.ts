/*
 * Created by Lin Liang-Han on 2023-7-11.
 * Copyright (c) 2023 Taiwan AI Labs.
 */

export interface Cell {
  row: number;
  column: number;
  surroundingMines: number;

  isMine?: boolean;
  isOpened?: boolean;
  isFlagged?: boolean;
}
