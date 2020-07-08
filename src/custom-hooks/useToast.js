import { useState } from "react";

export default function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToasts = (data) => {
    if (data && data.length > 0) {
      setToasts([...toasts, ...data]);
    } else {
      setToasts([]);
    }
  };

  const resetToasts = () => {
    setToasts([]);
  };

  let Toaster = {
    toasts,
    addToasts,
    resetToasts,
  };

  return Toaster;
}
