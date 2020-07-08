// useDeleteDoc custom hook used to make an api request delete a single row in a collection
// it uses a confirmation method by input authed user email(can be changed to anything else)
//
// Args: path(string): collection api path
// Return:
//  1. setRowID(function): set the doc id that we want to delete
//  2. setDeleteInput(function): set authed user email value
//  3. deleteInput(string): authed user email value
//  4. deleteInputError(string): email validation error
//  5. deleteSubmitting(boolean): submit state to prevent form multi submission
//  6. handleOnChange(function): handle input value on change
//  7. handleOnSubmit(function): handle form on submit

import { useState, useEffect } from "react";
import { navigate } from "@reach/router";

import { instance, APILink } from "../components/API";

import { useAuthContext } from "../context/useAuthContext";

export default function useDeleteDoc(path) {
  const [rowID, setRowID] = useState(0);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleteInputError, setDeleteInputError] = useState("");
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const { authUser } = useAuthContext();

  const APIRequestLink = APILink + path + "/" + rowID + "/";

  useEffect(() => {
    function deleteDoc() {
      instance
        .delete(APIRequestLink)
        .then((res) => {
          navigate("/" + path + "/");
        })
        .catch((error) => setDeleteInputError(error));
    }

    if (deleteSubmitting) {
      if (!deleteInputError) {
        deleteDoc();
        setDeleteSubmitting(false);
      } else {
        setDeleteSubmitting(false);
      }
    }
  }, [deleteSubmitting]);

  function handleOnChange(event) {
    setDeleteInput(event.target.value);
  }

  function handleOnSubmit(event) {
    event.preventDefault();
    setDeleteInputError(validateInput());
    setDeleteSubmitting(true);
  }

  function validateInput() {
    let error = "";
    if (!deleteInput) error = "Input Confirmation Required";
    else if (deleteInput !== authUser.email) error = "Input Confirmation Wrong";
    return error;
  }

  let deleteDoc = {
    setRowID,
    setDeleteInput,
    deleteInput,
    deleteInputError,
    deleteSubmitting,
    handleOnChange,
    handleOnSubmit,
  };

  return deleteDoc;
}
