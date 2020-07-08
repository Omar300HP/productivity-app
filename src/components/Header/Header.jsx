import React, { useState } from "react";
import { Link } from "react-router-dom";

import useRenderTranslationLabels from "../../custom-hooks/useRenderTranslationLabels";
import { useAppLanguageContext } from "../../context/useAppLanguageContext";
import { useAuthContext } from "../../context/AuthContext";
import { instance } from "../../components/API";
import cookie from "js-cookie";
import { useHistory } from "react-router-dom";
import ramz_logo from "../../images/rmz-logo.png";

import "./Header.scss";

export default function Header() {
  const history = useHistory();
  const { appLanguage, setAppLanguage } = useAppLanguageContext();
  const translationLabels = useRenderTranslationLabels();
  const { authUser, setAuthUser } = useAuthContext();

  const [logoutDropdown, setLogoutDropdown] = useState(false);

  const handleLogout = () => {
    cookie.remove("token");
    instance.interceptors.request.use((config) => {
      config = {
        ...config,
        headers: {
          "Content-Type": "application/json",
          Authorization: null,
        },
      };
      return config;
    });
    sessionStorage.removeItem("system_user");
    setTimeout(() => setAuthUser(null), 3000);
    history.push("/logout");
  };

  return (
    <div className="header">
      <ul className="header-panel">
        <img src={ramz_logo} alt="ramz_logo" className="ramz-logo" />
        {/* <li>
          <Link className="hl header-item">
            <i className="fas fa-bell"></i>
            {translationLabels.renderLabel("notifications")}
            <i id="dropdown-icon" className="fa fa-angle-down ml-2"></i>
          </Link>
        </li> */}
        <div className="divider"></div>
        <li>
          <Link to="/profile/" className="hl header-item">
            <i className="fas fa-user"></i>
            {authUser && authUser.user && authUser.user.firstName}
          </Link>
        </li>
        <li>
          <Link
            className="hl header-item"
            onClick={() => {
              if (appLanguage === 1) {
                setAppLanguage(2);
              } else {
                setAppLanguage(1);
              }
            }}
          >
            <i className="fas fa-globe" />
            {translationLabels.renderLabel("display_language")}
          </Link>
        </li>
        <button
          id="settings-button"
          onClick={() => setLogoutDropdown(!logoutDropdown)}
        >
          <i className="fas fa-ellipsis-v" />
        </button>
        {logoutDropdown && (
          <div className="logout-dropdown">
            <button
              className="btn btn-primary logout-btn"
              onClick={() => handleLogout()}
            >
              <i className="fas fa-sign-out-alt mr-2" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </ul>
    </div>
  );
}
