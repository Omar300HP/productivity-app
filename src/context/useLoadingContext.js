// Loading Context to display the spinner whenever there is a pending api request

import { createContext, useContext } from 'react';

export const LoadingContext = createContext();

export function useLoadingContext() {
  return useContext(LoadingContext);
}