/*
 * Created by Lin Liang-Han on 2023-7-11.
 * Copyright (c) 2023 Taiwan AI Labs.
 */

import { BehaviorSubject, Subject } from "rxjs";
import { FC, HTMLAttributes, createContext, useState } from "react";

import { cloneDeep } from "lodash";
import { useLifecycles } from "react-use";

export interface MinesweeperContextProps {
  reqReset$: Subject<void>;
  reqOpenCell$: BehaviorSubject<[number, number] | undefined>;
  reqFlagCell$: BehaviorSubject<[number, number] | undefined>;
  reqShowMines$: BehaviorSubject<boolean>;
}

export const MinesweeperContextDefault: MinesweeperContextProps = Object.seal({
  reqReset$: new Subject<void>(),
  reqOpenCell$: new BehaviorSubject<[number, number] | undefined>(undefined),
  reqFlagCell$: new BehaviorSubject<[number, number] | undefined>(undefined),
  reqShowMines$: new BehaviorSubject<boolean>(false),
});

export const MinesweeperContext = createContext<MinesweeperContextProps>(
  MinesweeperContextDefault
);

export const MinesweeperContextProvider: FC<HTMLAttributes<HTMLElement>> = ({
  children,
}) => {
  /** State */
  const [context, setContext] = useState<MinesweeperContextProps>(
    MinesweeperContextDefault
  );

  /** Lifecycle */
  useLifecycles(
    () => setContext(cloneDeep(MinesweeperContextDefault)),
    () => {}
  );

  /** Render */
  return (
    <MinesweeperContext.Provider value={context}>
      {children}
    </MinesweeperContext.Provider>
  );
};
