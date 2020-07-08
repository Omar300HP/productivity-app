import React, { useState } from "react";
import "./SideNavbar.scss";

import { adminRoutes } from "../admin_routes";

import { useAuthContext } from "../../context/AuthContext";

import { NavLink } from "react-router-dom";

import useRenderTranslationLabels from "../../custom-hooks/useRenderTranslationLabels";

export default function SideNavbar() {
  const { authUser } = useAuthContext();
  const [sideNavbar, setSideNavbar] = useState(true);
  const translationLabels = useRenderTranslationLabels();

  return (
    <div className={`mp side-navbar ${sideNavbar ? "expanded" : "collapsed"}`}>
      <button
        className={`side-navbar-btn ${sideNavbar ? "expanded" : ""}`}
        onClick={() => setSideNavbar(!sideNavbar)}
      >
        <i className="fas fa-bars" />
      </button>
      {authUser.permissions && authUser.permissions.length > 0
        ? authUser.permissions.map((permission, index) => {
            if (permission.value) {
              const admin_route = adminRoutes.find(
                (adminRoute) => adminRoute.route === permission.name
              );
              return (
                admin_route && (
                  <NavLink
                    key={index}
                    to={`/${admin_route.route}/`}
                    className="side-navbar-link"
                    activeClassName="active"
                  >
                    <i className={admin_route.icon} />
                    <span>
                      {sideNavbar &&
                        translationLabels.renderLabel(
                          admin_route.label.toLowerCase()
                        )}
                    </span>
                  </NavLink>
                )
              );
            } else return null;
          })
        : null}
      {sideNavbar && (
        <div className="powerdBy">
          {translationLabels.renderLabel("powered_by")}{" "}
          <a href="https://swisodev.com/">SWISO DEV</a>
        </div>
      )}
    </div>
  );
}
