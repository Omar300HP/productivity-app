import React, { useEffect } from "react";
import { useToastContext } from "../../context/useToastContext";

import "./Home.scss";
export default function Home() {
  const { addToasts } = useToastContext();

  useEffect(() => {
    addToasts([
      {
        severity: "success",
        summary: "Welcome!",
        sticky: true,
        detail: (
          <span style={{ fontSize: "0.7vw" }}>
            Hope you find this app helpful!{" "}
            <i
              style={{ color: "#726012", fontSize: "0.9vw" }}
              className="far fa-smile-wink"
            ></i>
          </span>
        ),
      },
    ]);
  }, []);

  return (
    <div className="route-container">
      <h1>
        <i style={{ color: "red" }} className="flash fas fa-heartbeat"></i>I
        Love YOU YA ALAA!!!
        <i style={{ color: "red" }} className="flash fas fa-heartbeat"></i>
        <h2 style={{ color: "red" }} className="flash">
          <i style={{ color: "red" }} className="flash fas fa-heartbeat"></i>
          GEEEEDAN!
          <i style={{ color: "red" }} className="flash fas fa-heartbeat"></i>
        </h2>
      </h1>
    </div>
  );
}
