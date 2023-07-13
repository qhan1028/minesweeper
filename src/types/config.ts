/*
 * Created by Lin Liang-Han on 2023-7-14.
 */

export interface Config {
  rows: number;
  columns: number;
  mines: number;
}

export const DefaultConfig: Config = {
  rows: 10,
  columns: 20,
  mines: 40,
};
