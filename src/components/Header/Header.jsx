import React, { useState } from "react";

import "./Header.scss";

import header_logo from "../../images/header-logo.png";
import { useSideBarContext } from "../../context/useSideBarContext";

export default function Header() {
  const { setSideBar, sideBar } = useSideBarContext();
  return (
    <div className="header">
      <div className="logo-container">
        <i
          className="menu-icon fas fa-bars"
          onClick={() => {
            setSideBar(!sideBar);
          }}
        ></i>
        <img className="main-logo" src={header_logo} alt="logo" />
      </div>

      <span className="title">Productivity app.</span>
    </div>
  );
}
