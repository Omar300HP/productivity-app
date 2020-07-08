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

import Home from "./routes/Home/Home";

import { LoadingContext } from "./context/useLoadingContext";
import { ToastContext } from "./context/useToastContext";

import useAuth from "./custom-hooks/useAuth";

import { instance } from "./components/API";
import cookie from "js-cookie";
import useRenderTranslationLabel from "./custom-hooks/useRenderTranslationLabels";

export default function App() {
  const location = useLocation();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const setRequestLoading = (data) => {
    setLoading(data);
  };

  const setResponseToast = (data) => {
    setToast(data);
  };

  return (
    <LoadingContext.Provider value={{ setLoading: setRequestLoading }}>
      {loading && <Loader />}
      <ToastContext.Provider value={{ setToast: setResponseToast, toast }}>
        {toast && <Toast />}

        <div className={`App `}>
          <Header />
          <div className="parent-container">
            <SideNavbar />

            <Switch>
              <Route component={Home} path="/home" />
            </Switch>
          </div>
        </div>
      </ToastContext.Provider>
    </LoadingContext.Provider>
  );
}
