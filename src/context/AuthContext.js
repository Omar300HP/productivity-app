// Authentication Context to get authenticated user data

import { createContext, useContext } from "react";

export const AuthContext = createContext();

export function useAuthContext() {
  return useContext(AuthContext);
}
