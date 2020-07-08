import { useState, useEffect, useReducer } from "react";
import { instance } from "../components/API";

import cookie from "js-cookie";

export default function useAuth(toaster, language) {
  const { renderLabel } = language;
  const { addToasts } = toaster;

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const initialState = {
    errors: {},
    isSubmitting: false,
    toasts: null,
    logged_in: false,
    authUser: null,
    selected_organization: null,
  };

  function reducer(state, action) {
    switch (action.type) {
      case "SUBMIT_FORM":
        return {
          ...state,
          errors: action.validate_fn,
          isSubmitting: true,
        };
      case "SUBMIT_OFF":
        return {
          ...state,
          isSubmitting: false,
        };
      case "AUTH_SUCCESS":
        instance.interceptors.request.use((config) => {
          config = {
            ...config,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${action.payload.token}`,
            },
          };
          return config;
        });

        let access_rights = [];
        if (action.payload.user.isAdmin) {
          access_rights = [
            { name: "user_management", value: true },
            { name: "organization_management", value: true },
            { name: "dynamic_forms", value: true },
            { name: "workflow", value: true },
            { name: "requests", value: true },
            { name: "notifications", value: true },
            { name: "lookups", value: true },
            { name: "playground", value: true },
          ];
        } else {
          access_rights = [
            { name: "user_management", value: false },
            { name: "organization_management", value: false },
            { name: "dynamic_forms", value: false },
            { name: "workflow", value: false },
            { name: "requests", value: false },
            { name: "notifications", value: false },
            { name: "lookups", value: false },
            { name: "playground", value: false },
          ];
        }

        let system_user = {};
        system_user.user = action.payload.user;
        system_user.permissions = access_rights;

        cookie.set("token", action.payload.token);
        sessionStorage.setItem("system_user", JSON.stringify(system_user));
        addToasts([
          {
            severity: "success",
            summary: "",
            detail:
              renderLabel("welcome") + " " + action.payload.user.firstName,
          },
        ]);
        return {
          ...state,
          isSubmitting: false,
          authUser: system_user,
          logged_in: true,
        };
      case "AUTH_FAILED":
        addToasts([
          {
            severity: "error",
            summary: renderLabel("error"),
            detail: action.error,
          },
        ]);
        return {
          ...state,
          error: action.error,
          isSubmitting: false,
        };
      case "GET_USER_STORAGE":
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
        return {
          ...state,
          authUser: JSON.parse(sessionStorage.getItem("system_user")),
        };
      case "SELECT_ORGANIZATION":
        return {
          ...state,
          selected_organization: action.organization,
        };
      case "LOGOUT":
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
        return {
          ...state,
          authUser: null,
        };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.isSubmitting) {
      if (Object.keys(state.errors).length === 0) {
        instance
          .post("auth/login/", values)
          .then((res) => {
            dispatch({
              type: "AUTH_SUCCESS",
              payload: res.data,
            });
          })
          .catch((error) => {
            dispatch({
              type: "AUTH_FAILED",
              error:
                error.response.status === 500
                  ? renderLabel("wrong_credentials")
                  : renderLabel("connection_error"),
            });
          });
      } else {
        dispatch({
          type: "SUBMIT_OFF",
        });
      }
    }
  }, [state.isSubmitting]);

  //handle form fields onChange
  const handleChange = ({ input_name, input_value }) => {
    setValues({ ...values, [input_name]: input_value });
  };

  // login form front end validation
  const validateForm = (values) => {
    let errors = {};

    if (!values.email) {
      errors.email = "Username Required";
    }

    if (!values.password) {
      errors.password = "Password Required";
    }

    return errors;
  };

  // handle form onSubmit
  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch({
      type: "SUBMIT_FORM",
      validate_fn: validateForm(values),
    });
  };

  return {
    handleChange,
    handleSubmit,
    state,
    dispatch,
    values,
  };
}
