// AppLanguage Context to control the language which is displayed and the ui direction

import { createContext, useContext } from "react";

export const AppLanguageContext = createContext();

export function useAppLanguageContext() {
  return useContext(AppLanguageContext);
}
