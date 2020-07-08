// useCollection custom hook used to make an api request list all docs in a collection
// it also checks if the current route should re render based on should collection update
//
// Args: path(string): collection api path
// Return: docs(array of objects): collection docs
import { useState, useEffect } from "react";
import { instance } from "../components/API";

export default function usePrimeTableLazyScroll({
  path,
  paginationLimit,
  defaultQueryParams = {},
}) {
  const [docs, setDocs] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState({});

  const [queryParams, setQueryParams] = useState({ ...defaultQueryParams });
  const [params, setParams] = useState({ ...defaultQueryParams });

  useEffect(() => {
    instance
      .get(
        `${path}${"/?page=" + page}${
          paginationLimit ? "&limit=" + paginationLimit : ""
        }`,
        { params: queryParams }
      )
      .then((res) => {
        setTotalRecords(res.data.count);
        let rows = [...docs];
        rows.push(...res.data.rows);
        setDocs(rows);
      })
      .catch((error) => {
        setError(error.data);
        console.log(error);
      })
      .then(() => {});
  }, [path, page]);

  const getNext = () => {
    if (page + 1 <= Math.ceil(totalRecords / paginationLimit))
      setPage(page + 1);
  };

  const collection = {
    docs,
    totalRecords,
    getNext,
  };

  return collection;
}
