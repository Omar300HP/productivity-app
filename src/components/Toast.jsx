import React, { useState, useEffect, useRef } from "react";
import { useToastContext } from "../context/useToastContext";
import { Growl } from "primereact/growl";

// severity : success || info || warn || error || info
// { severity: "info", summary: "Message 3", detail: "PrimeFaces rocks" , sticky:false , life:3000},

export default function Toast() {
  const { resetToasts, toasts } = useToastContext();

  let growl = useRef(null);

  const showMultiple = (toastQueue) => {
    growl.current.show(toastQueue);
  };

  useEffect(() => {
    if (toasts && toasts.length > 0) {
      let toastQueue = [...toasts];
      showMultiple(toastQueue);
      resetToasts();
    }
  }, [toasts]);

  return (
    <Growl
      position="bottomright"
      baseZIndex={99999}
      ref={growl}
      style={{ width: "21em" }}
    />
  );
}
