/*
 * Created by Lin Liang-Han on 2023-7-12.
 */

export enum State {
  INIT,
  START,
  PLAYING,
  SUCCEED,
  FAILED,
}

export const DefaultState: State = State.INIT;
