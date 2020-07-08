//  global loader components renders loading spinner

import React from "react";

import loader from "../images/preloader-100.gif";

export default function Loader() {
  return (
    <div className="loading-spinner">
      <img src={loader} alt="loader" />
    </div>
  );
}
