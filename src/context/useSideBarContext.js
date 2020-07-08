// Loading Context to display the spinner whenever there is a pending api request

import { createContext, useContext } from "react";

export const SideBarContext = createContext();

export function useSideBarContext() {
  return useContext(SideBarContext);
}
