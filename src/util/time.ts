/*
 * Created by Lin Liang-Han on 2023-7-14.
 */

export const msToString = (time: number) => {
  const hour = Math.floor(time / 1000 / 60 / 60)
    .toString()
    .padStart(2, "0");
  const min = (Math.floor(time / 1000 / 60) % 60).toString().padStart(2, "0");
  const sec = (Math.floor(time / 1000) % 60).toString().padStart(2, "0");
  return { hour, min, sec };
};
