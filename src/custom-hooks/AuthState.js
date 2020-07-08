import React, { useState, useEffect, useReducer } from "react";
import { AuthContext } from "../context/AuthContext";
import useRenderTranslationLabels from "./useRenderTranslationLabels";
import { instance } from "../components/API";
import cookie from "js-cookie";

export default function AuthState(props) {
  const translationLabels = useRenderTranslationLabels();
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const initialState = {
    errors: {},
    isSubmitting: false,
    loading: null,
    toast: null,
    authUser: null,
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
        if (action.payload.user.Role.name.toLowerCase() === "admin") {
          access_rights = [{ name: "connections", value: true }];
        } else if (
          action.payload.user.Role.name.toLowerCase() === "developer"
        ) {
          access_rights = [{ name: "connections", value: true }];
        } else {
          access_rights = [{ name: "connections", value: false }];
        }

        let system_user = {};
        system_user.user = action.payload.user;
        system_user.permissions = access_rights;

        cookie.set("token", action.payload.token);
        sessionStorage.setItem("system_user", JSON.stringify(system_user));

        return {
          ...state,
          isSubmitting: false,
          toast: {
            type: "success",
            label: `${translationLabels.renderLabel("welcome")} ${
              action.payload.user.firstName
            }`,
          },
          loading: false,
          authUser: system_user,
          logged_in: true,
        };
      case "AUTH_FAILED":
        return {
          ...state,
          error: action.error,
        };
      case "GET_USER_STORAGE":
        return {
          ...state,
          authUser: JSON.parse(sessionStorage.getItem("system_user")),
        };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.isSubmitting) {
      if (Object.keys(state.errors).length === 0) {
        dispatch({
          type: "SET_LOADING",
        });
        instance
          .post("auth/", values)
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
                  ? translationLabels.renderLabel("wrong_credentials")
                  : translationLabels.renderLabel("connection_error"),
            });
          });
      } else {
        dispatch({
          type: "SUBMIT_OFF",
        });
      }
    }
  }, [
    translationLabels,
    values,
    state.errors,
    state.isSubmitting,
    state.loading,
  ]);

  //handle form fields onChange
  const handleChange = ({ input_name, input_value }) => {
    setValues({ ...values, [input_name]: input_value });
  };

  // login form front end validation
  const validateForm = (values) => {
    let errors = {};

    if (!values.email) {
      errors.email = "Email Required";
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

  // get user data from session storage
  const getUserStorage = () => {
    dispatch({
      type: "GET_USER_STORAGE",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        values: values,
        errors: state.errors,
        isSubmitting: state.isSubmitting,
        authUser: state.authUser,
        logged_in: state.logged_in,
        handleSubmit,
        handleChange,
        getUserStorage,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
