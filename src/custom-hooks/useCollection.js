// useCollection custom hook used to make an api request list all docs in a collection
// it also checks if the current route should re render based on should collection update
// supports primereact datatable pagination, sorting and filtering

import { useState, useEffect } from "react";
import { instance } from "../components/API";
import { useToastContext } from "../context/useToastContext";
import { useAppLanguageContext } from "../context/useAppLanguageContext";

export default function useCollection({
  path,
  allowPagination = false,
  paginationLimit = null,
  defaultQueryParams = {},
}) {
  const { renderLabel } = useAppLanguageContext();
  const { addToasts } = useToastContext();

  const [docs, setDocs] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [last, setLast] = useState(paginationLimit);
  const [page, setPage] = useState(1);
  const [error, setError] = useState({});

  const [queryParams, setQueryParams] = useState({ ...defaultQueryParams });
  const [params, setParams] = useState({ ...defaultQueryParams });
  const [sortState, setSortState] = useState({});
  const [filterState, setFilterState] = useState({});
  const [globalFilterState, setGlobalFilterState] = useState("");

  const [refreshVar, setRefreshVar] = useState(0);

  useEffect(() => {
    instance
      .get(
        `${path}${allowPagination ? "/?page=" + page : ""}${
          paginationLimit ? "&limit=" + paginationLimit : ""
        }`,
        { params: queryParams }
      )
      .then((res) => {
        setTotalRecords(res.data.count);
        setDocs(res.data.rows);
        if (res.data.rows.length === 0) {
          setFirst(-1);
          setLast(-1);
        } else {
          setLast(Math.min(first + paginationLimit, res.data.count));
        }
      })
      .catch((error) => {
        setError(error.data);
        addToasts([
          {
            severity: "error",
            summary: renderLabel("error"),
            detail: renderLabel("get_error"),
          },
        ]);
      })
      .then(() => {});
  }, [path, page, params, refreshVar]);

  const handleRefresh = () => {
    setQueryParams({ ...defaultQueryParams });
    setParams({ ...defaultQueryParams });
    setPage(1);
    setFirst(0);
    setLast(paginationLimit);
    setRefreshVar(refreshVar + 1);
  };

  const handleOnFilter = (e) => {
    let filterParams = {};
    const filters = e.filters;
    Object.keys(filters).map((key) => (filterParams[key] = filters[key].value));
    setQueryParams({ ...queryParams, ...filterParams });
    setFilterState(filters);
  };

  const handleOnGlobalFilter = (e) => {
    setQueryParams({ ...queryParams, globalFilter: e.target.value });
    setGlobalFilterState(e.target.value);
  };

  const handleSubmitFilter = (e) => {
    setParams(queryParams);
  };

  const handleOnSort = (e) => {
    setSortState(e);
    setQueryParams({
      ...queryParams,
      sortField: e.sortField,
      sortOrder: e.sortOrder === 1 ? "ASC" : "DESC",
    });
    setParams({
      ...params,
      sortField: e.sortField,
      sortOrder: e.sortOrder === 1 ? "ASC" : "DESC",
    });
  };

  const handleOnPageChange = (event) => {
    setFirst(event.first);
    setLast(Math.min(event.first + paginationLimit, totalRecords));
    setPage(event.page + 1);
  };

  const collection = {
    docs,
    first,
    last,
    totalRecords,
    sortState,
    filterState,
    globalFilterState,
    handleOnFilter,
    handleOnGlobalFilter,
    handleSubmitFilter,
    handleOnSort,
    handleOnPageChange,
    handleRefresh,
  };

  return collection;
}
