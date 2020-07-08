// AppLanguage Context to control the language which is displayed and the ui direction

import { createContext, useContext } from "react";

export const TimerCardContext = createContext();

export function useTimerCardContext() {
  return useContext(TimerCardContext);
}
