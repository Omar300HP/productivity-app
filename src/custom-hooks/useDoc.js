// useDoc custom hook used to make an api request get a single doc in a collection
//
// Args:
//  1. path(string): collection api path
//  2. docID(int): target doc ID
// Return: doc(object): target doc

import { useState, useEffect } from "react";

import { instance, APILink } from "../components/API";
import { useToastContext } from "../context/useToastContext";
import { useAppLanguageContext } from "../context/useAppLanguageContext";

export default function useDoc(path, params = null) {
  const [doc, setDoc] = useState(null);
  const [refreshReq, setRefreshReq] = useState(0);
  const [error, setError] = useState({});
  const { renderLabel } = useAppLanguageContext();
  const { addToasts } = useToastContext();

  useEffect(() => {
    console.log(path);
    if (path !== null) {
      instance
        .get(path, { params })
        .then((res) => setDoc(res.data))
        .catch((error) => {
          setError(error.data);
          addToasts([
            {
              severity: "error",
              summary: renderLabel("error"),
              detail: renderLabel("get_error"),
            },
          ]);
        });
    }
  }, [path, refreshReq]);

  const refreshFn = () => {
    setRefreshReq(refreshReq + 1);
  };

  const collection = {
    doc,
    refreshFn,
  };
  return collection;
}
