import React, { useState, useEffect } from "react";

import {
  Route,
  Switch,
  Redirect,
  useLocation,
  useHistory,
} from "react-router-dom";

import Loader from "./components/Loader";
import Toast from "./components/Toast";

import Header from "./components/Header/Header";
import SideNavbar from "./components/SideNavbar/SideNavbar";

import Login from "./routes/Login/Login";
import Logout from "./routes/Logout/Logout";
import Home from "./routes/Home/Home";

import { AuthContext, useAuthContext } from "./context/AuthContext";
import { LoadingContext } from "./context/useLoadingContext";
import { ToastContext } from "./context/useToastContext";
import { AppLanguageContext } from "./context/useAppLanguageContext";

import useAuth from "./custom-hooks/useAuth";

import { instance } from "./components/API";
import cookie from "js-cookie";
import useRenderTranslationLabel from "./custom-hooks/useRenderTranslationLabels";

export default function App() {
  const location = useLocation();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const authentication = useAuth();
  const language = useRenderTranslationLabel();
  const { authUser, logged_in } = authentication.state;

  const setRequestLoading = (data) => {
    setLoading(data);
  };

  const setResponseToast = (data) => {
    setToast(data);
  };

  useEffect(() => {
    if (authUser && authUser.user.isNew) {
      history.push("/profile");
    } else {
      if (logged_in) {
        history.push("/home");
      }
    }
  }, [authUser, logged_in]);

  useEffect(() => {
    instance.interceptors.request.use((config) => {
      config = {
        ...config,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie.get("token")}`,
        },
      };
      return config;
    });
    authentication.getUserStorage();
  }, []);

  return (
    <AppLanguageContext.Provider value={language}>
      <LoadingContext.Provider value={{ setLoading: setRequestLoading }}>
        {loading && <Loader />}
        <ToastContext.Provider value={{ setToast: setResponseToast, toast }}>
          {toast && <Toast />}
          <AuthContext.Provider value={authentication}>
            <div className={`App ${language.appLanguage === 1 ? "rtl" : ""}`}>
              {!authUser && <Redirect from="/" to="/login" />}
              {authUser &&
              location.pathname !== "/login" &&
              location.pathname !== "/logout" ? (
                <Header />
              ) : null}
              <div className="parent-container">
                {authUser &&
                  authUser.user.roleId !== 3 &&
                  location.pathname !== "/home" &&
                  location.pathname !== "/logout" && <SideNavbar />}
                <Switch>
                  <Route component={Login} path="/login" />
                  <PrivateRoute component={Home} path="/home" />
                  <PrivateRoute path="/logout" component={Logout} />
                </Switch>
              </div>
            </div>
          </AuthContext.Provider>
        </ToastContext.Provider>
      </LoadingContext.Provider>
    </AppLanguageContext.Provider>
  );
}

function PrivateRoute({ component: Component, ...rest }) {
  const { state } = useAuthContext();
  const { authUser } = state;

  return (
    <Route
      {...rest}
      render={(props) =>
        authUser ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}
