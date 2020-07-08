// TryndaForm is a replacement of Formik,
// it is used as a form handler in case it contains a custom picklist component to create or edit a collection doc
// Potentially would be added later to the TryndaForm as onChange Handlers and Picklist Event Handlers.
// Functionalities:
//  1. Form Validation for picklist item input field
//  2. Form Handling on Change for picklist item input field
//  3. Form Handling on Blur for picklist item input field
//  4. Form Submission
//  5. Event Handler when adding items to the selected area
//  6. Event Handler when removing items from the selected area
//
// Args:
//  1. initial_state(dictionary): form fields schema
//  2. validateFn(function): form validation function
//  3. path(string): collection path
//  4. callbackFn(function): callback function after submitting the form
//
// Return:
// 1. handleSubmit(function): handle form on submit
// 2. handleBlur(function): handle form fields on blur
// 3. handleChange(function): handle form field input of type text/email/password/number value on change
// 4. handleSelectChange(function): handle form field input of type react-select value on change
// 5. handleSelectedProductValuesChange(function): handle form picklist item input field value on change
// 6. addSelectedProducts(function): event handler when adding items[s] to the selected area
// 7. addAllSelectedProducts(function): event handler when adding all items at once to the selected area
// 8. removeSelectedProducts(function): event handler when removing items[s] from the selected area
// 9. removeAllSelectedProducts(function): event handler when removing all items at once from the selected area
// 10. rowID(int): target doc ID for patching
// 11. setRowID(function): set the row ID we want to patch
// 12. values(array of objects): form fields values
// 13. setValues(function): set form fields values
// 14. errors(array of objects): form validation errors
// 15. isSubmitting(boolean): submit state of to prevent form multi submission

import { useState, useEffect } from "react";

import { instance } from "../components/API";

import { useToastContext } from "../context/useToastContext";
import { useAppLanguageContext } from "../context/useAppLanguageContext";

export default function useTryndaForm(
  initial_state,
  validateFn,
  path,
  callbackFn = null
) {
  const { renderLabel } = useAppLanguageContext();
  const { addToasts } = useToastContext();
  const [values, setValues] = useState(initial_state);
  const [errors, setErrors] = useState([]);
  const [rowID, setRowID] = useState(0);
  const [isSubmitting, setSubmitting] = useState(false);
  const [canNavigate, setCanNavigate] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ForgetPassword = () => {
      instance
        .post(path, values)
        .then((res) => {
          console.log(res);
          addToasts([
            {
              severity: "success",
              summary: renderLabel("success"),
              detail: renderLabel("reset_email_sent"),
            },
          ]);
        })
        .catch((error) => {
          if (error.response.status === 500) {
            setErrors({
              credentials: renderLabel("wrong_credentials"),
            });
          } else {
            console.log(error);
            setErrors({
              connection: renderLabel("connection_error"),
            });
          }
        });
    };

    const ChangePassword = () => {
      delete values.confirm_password;
      instance
        .post(path, values)
        .then(() => {
          addToasts([
            {
              severity: "success",
              summary: renderLabel("success"),
              detail: renderLabel("password_reset_success"),
            },
          ]);
        })
        .catch((error) => {
          if (error.data && error.data.msgEn) {
            setErrors({
              credentials: error.data.msgEn,
            });
          } else {
            console.log(error);
            setErrors({
              connection: renderLabel("connection_error"),
            });
          }
        });
    };
    const bulkUpload = () => {
      instance
        .post("users/bulk", values)
        .then(() => {
          addToasts([
            {
              severity: "success",
              summary: renderLabel("success"),
              detail: renderLabel("password_reset_success"),
            },
          ]);
        })
        .catch((error) => {
          if (error.data && error.data.msgEn) {
            setErrors({
              credentials: error.data.msgEn,
            });
          } else {
            console.log(error);
            setErrors({
              connection: renderLabel("connection_error"),
            });
          }
        });
    };

    const postForm = () => {
      instance
        .post(path, values)
        .then((res) => {
          addToasts({ type: "success", label: "تم إضافة البيانات بنجاح" });
          callbackFn();
        })
        .catch((error) => {
          addToasts({ type: "error", label: "خطأ! " + error });
        });
    };

    // following handle form onSubmit onClick
    if (isSubmitting) {
      if (errors.length === 0 || Object.keys(errors).length === 0) {
        switch (path) {
          case "auth/forget/":
            ForgetPassword();
            break;
          case "UPLOAD_API":
            bulkUpload();
            break;
          default:
            break;
        }

        if (path.includes("auth/change-password")) {
          ChangePassword();
        }

        setSubmitting(false);
      } else {
        setSubmitting(false);
      }
    }
  }, [values, errors, isSubmitting, path, callbackFn, addToasts]);

  // handle form onSubmit
  const handleSubmit = (event) => {
    event.preventDefault();
    // setErrors(validateFn(values)); // front end validation
    setSubmitting(true);
  };

  //handle form fields onChange
  const handleChange = ({
    input_name,
    input_value,
    parent_array = null,
    child_id = 0,
  }) => {
    if (parent_array) {
      // search for object index in the parent array with child_element_id
      // then replace the element old value with the new one
      // then replace the old array(form_field) with the new array(form_field)
      let arr = [...values[parent_array]];
      const index = arr.findIndex((el) => el.child_id === child_id);
      let element = {
        ...arr[index],
        [input_name]: input_value,
      };
      arr.splice(index, 1, element);
      setValues({
        ...values,
        [parent_array]: arr,
      });
    } else {
      // replace the form_field with the new form_field
      setValues({ ...values, [input_name]: input_value });
    }
  };

  function handleSelectChange(newValue, actionMeta) {
    setValues({
      ...values,
      [actionMeta.name]: newValue ? newValue.value : "",
    });
  }
  // handling adding new element in a dynamic array form field
  function addNewElement(field_array, field_values) {
    let arr = [...values[field_array]];
    arr.push(field_values);
    setValues({
      ...values,
      [field_array]: arr,
    });
  }

  // handling removing an existing element from the dynamic array form field
  function removeElement(field_array, id) {
    let arr = [...values[field_array]];
    let child_index = arr.findIndex((child) => child.child_id === id);
    arr.splice(child_index, 1);
    setValues({
      ...values,
      [field_array]: arr,
    });
  }

  // handling reset all form fields
  function resetForm() {
    setValues(initial_state);
  }

  let TryndaForm = {
    handleSubmit,
    handleChange,
    handleSelectChange,
    addNewElement,
    removeElement,
    resetForm,
    rowID,
    setRowID,
    values,
    setValues,
    canNavigate,
    setCanNavigate,
    isSubmitted,
    setSubmitted,
    errors,
    setErrors,
    isSubmitting,
  };

  return TryndaForm;
}
