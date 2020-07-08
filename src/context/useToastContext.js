// Loading Context to display the spinner whenever there is a pending api request

import { createContext, useContext } from "react";

export const ToastContext = createContext();

export function useToastContext() {
  return useContext(ToastContext);
}
