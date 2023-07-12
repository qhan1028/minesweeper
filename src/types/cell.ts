/*
 * Created by Lin Liang-Han on 2023-7-11.
 */

export interface Cell {
  row: number;
  column: number;
  surroundingMines: number;
  surroundingFlags: number;

  isMine?: boolean;
  isOpened?: boolean;
  isFlagged?: boolean;
}
