import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router";
import { createBrowserHistory } from "history";
import * as serviceWorker from "./serviceWorker";
import App from "./App";
import "./styles/styles.scss";
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

const history = createBrowserHistory({
  basename: "/wodooh/wodooh_frontend",
});

ReactDOM.render(
  <Router history={history} style={{ width: "100%" }}>
    <App />
  </Router>,
  document.getElementById("root")
);
