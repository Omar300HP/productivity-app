// Surpass the Frailty of your Form
// currentRoute {0: Search/View Mode, 1: Create/Edit Mode}

import { useState, useEffect, useReducer } from "react";
import { instance } from "../components/API";
import { useToastContext } from "../context/useToastContext";
import { useAppLanguageContext } from "../context/useAppLanguageContext";

export default function useAatroxForm(
  initial_form,
  validateFn,
  path,
  callbackFn = null
) {
  const [objectValues, setObjectValues] = useState(initial_form);
  const [canNavigate, setCanNavigate] = useState(true);

  const { appLanguage, renderLabel } = useAppLanguageContext();
  const { addToasts } = useToastContext();

  const initialState = {
    errors: {},
    isSubmitting: false,
    toasts: null,
    currentRoute: 0,
    api_call: null,
    selected_object: null,
    selected_row: null,
    selected_row_id: null,
  };

  function reducer(state, action) {
    switch (action.type) {
      case "SET_API":
        return {
          ...state,
          api_call: action.api_call,
        };
      case "SELECT_DYNAMIC_ARRAY_ROW":
        return {
          ...state,
          selected_row: action.row,
          selected_row_id: action.row_id,
        };
      case "SET_FORM_OBJECT":
        setObjectValues(action.selected_object);
        return {
          ...state,
          api_call: action.api_call,
          currentRoute: 1,
          selected_object: action.selected_object,
        };
      case "SET_CURRENT_ROUTE":
        return {
          ...state,
          currentRoute: action.route,
        };
      case "CREATE_NEW":
      case "CLEAR_FORM_OBJECT":
        setObjectValues(initial_form);
        return {
          ...state,
          selected_object: null,
          api_call: "POST",
        };
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
      case "POST_SUCCESS":
        addToasts([
          {
            severity: "success",
            summary: renderLabel("success"),
            detail: renderLabel("post_success"),
          },
        ]);
        return {
          ...state,
          isSubmitting: false,
          currentRoute: 0,
        };
      case "POST_FAILED":
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
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.isSubmitting) {
      if (Object.keys(state.errors).length === 0 || state.errors.length === 0) {
        let values = { ...objectValues };
        Object.keys(values).map((key) => {
          if (values[key] === "") delete values[key];
        });
        if (state.api_call === "POST") {
          instance
            .post(path, values)
            .then((res) => {
              dispatch({
                type: "POST_SUCCESS",
                payload: res.data,
              });
            })
            .catch((error) => {
              dispatch({
                type: "POST_FAILED",
                error: appLanguage === 1 ? error.msgAr : error.msgEn,
              });
              console.log(error);
            });
        } else if (state.api_call === "PUT") {
          instance
            .put(path + "/" + objectValues.id + "/", objectValues)
            .then((res) => {
              dispatch({
                type: "POST_SUCCESS",
                payload: res.data,
              });
            })
            .catch((error) => {
              dispatch({
                type: "POST_FAILED",
                error: appLanguage === 1 ? error.data.msgAr : error.data.msgEn,
              });
              console.log(error);
            });
        }
      } else {
        dispatch({
          type: "SUBMIT_OFF",
        });
      }
    }
    // eslint-disable-next-line
  }, [state.isSubmitting]);

  // check if the form objectValues is not empty to prevent navigation with unsaved objectValues
  //   useEffect(() => {
  //     for (const value in objectValues) {
  //       if (Array.isArray(objectValues[value])) {
  //         if (objectValues[value].length > 0 && !isSubmitted) {
  //             setCanNavigate(false);
  //         } else {
  //           setCanNavigate(true);
  //         }
  //       }
  //     }
  //   }, [objectValues]);

  // handle form onSubmit
  const handleSubmit = (event) => {
    console.log("here");
    if (event) {
      event.preventDefault();
    }

    dispatch({
      type: "SUBMIT_FORM",
      validate_fn: validateFn(objectValues),
    });
  };

  //handle form fields onChange
  const handleChange = ({
    input_name,
    input_value,
    parent_array = null,
    child_id = 0,
    parent_object = null,
  }) => {
    if (parent_array) {
      // search for object index in the parent array with child_element_id
      // then replace the element old value with the new one
      // then replace the old array(form_field) with the new array(form_field)
      let arr = [...objectValues[parent_array]];
      const index = arr.findIndex((el) => el.child_id === child_id);
      let element = {
        ...arr[index],
        [input_name]: input_value,
      };
      arr.splice(index, 1, element);
      setObjectValues({
        ...objectValues,
        [parent_array]: arr,
      });
    }
    if (parent_object) {
      setObjectValues({
        ...objectValues,
        [parent_object]: {
          ...objectValues[parent_object],
          [input_name]: input_value,
        },
      });
    } else {
      // replace the form_field with the new form_field
      setObjectValues({ ...objectValues, [input_name]: input_value });
    }
  };

  const handleMultiChange = (values_array) => {
    let obj = { ...objectValues };
    values_array.map((el) => {
      obj[el.input_name] = el.input_value;
    });
    setObjectValues(obj);
  };

  // handling adding new element in a dynamic array form field
  function addNewElement(field_array, field_values) {
    let arr = [...objectValues[field_array]];
    const f_values = {
      ...field_values,
      child_id: Date.now(),
    };
    arr.push(f_values);
    setObjectValues({
      ...objectValues,
      [field_array]: arr,
    });
  }

  // handling removing an existing element from the dynamic array form field
  function removeElement(field_array, id) {
    let arr = [...objectValues[field_array]];
    let child_index = arr.findIndex((child) => child.child_id === id);
    arr.splice(child_index, 1);
    setObjectValues({
      ...objectValues,
      [field_array]: arr,
    });
  }

  // handling reset all form fields
  function resetForm() {
    setObjectValues(initial_form);
  }

  let AatroxForm = {
    handleSubmit,
    handleChange,
    handleMultiChange,
    addNewElement,
    removeElement,
    resetForm,
    objectValues,
    state,
    dispatch,
  };

  return AatroxForm;
}
