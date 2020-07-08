import React, { useState, useEffect } from "react";
import { useToastContext } from "../context/useToastContext";

export default function Toast() {
  const { setToast, toast } = useToastContext();
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timerId = setInterval(() => countdownTimer(), 1000);

    if (countdown > 3) {
      setToast(null);
    }

    return function cleanup() {
      clearInterval(timerId);
    };
  });

  const countdownTimer = () => {
    const c = countdown + 1;
    setCountdown(c);
  };

  return (
    <div
      className={`toastram ${toast.type === "success" ? "success" : "error"}`}
      onClick={() => setToast(false)}
    >
      <i
        className={`fas ${
          toast.type === "success" ? "fa-check" : "fa-times"
        } mr-2`}
      />
      {toast.label}
    </div>
  );
}
