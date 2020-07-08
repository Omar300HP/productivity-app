import React, { useState } from "react";
import "./SideNavbar.scss";
import { useSideBarContext } from "../../context/useSideBarContext";

export default function SideNavbar() {
  const { sideBar } = useSideBarContext();

  return <div className={`side-navbar ${sideBar ? "opened" : "closed"}`}></div>;
}
