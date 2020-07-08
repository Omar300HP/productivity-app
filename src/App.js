import React, { useState, useEffect } from "react";

import {
  Route,
  Switch,
  // Redirect,
  // useLocation,
  // useHistory,
} from "react-router-dom";

import Loader from "./components/Loader";
import Toast from "./components/Toast";

import Header from "./components/Header/Header";
import SideNavbar from "./components/SideNavbar/SideNavbar";

import Home from "./routes/Home/Home";

import { LoadingContext } from "./context/useLoadingContext";
import { ToastContext } from "./context/useToastContext";
import { SideBarContext } from "./context/useSideBarContext";
import { TimerCardContext } from "./context/useTimerCardContext";

import useToast from "./custom-hooks/useToast";

export default function App() {
  // const location = useLocation();
  // const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [sideBar, setSideBar] = useState(true);
  const toaster = useToast();

  const setRequestLoading = (data) => {
    setLoading(data);
  };

  return (
    <LoadingContext.Provider value={{ setLoading: setRequestLoading }}>
      {loading && <Loader />}
      <ToastContext.Provider value={toaster}>
        <SideBarContext.Provider
          value={{ setSideBar: setSideBar, sideBar: sideBar }}
        >
          <Toast />
          <div className={`App`}>
            <Header />
            <SideNavbar />
            <div
              className={`parent-container ${sideBar ? "opened" : "closed"}`}
            >
              <Switch>
                <Route component={Home} path="/" />
              </Switch>
            </div>
          </div>
        </SideBarContext.Provider>
      </ToastContext.Provider>
    </LoadingContext.Provider>
  );
}
