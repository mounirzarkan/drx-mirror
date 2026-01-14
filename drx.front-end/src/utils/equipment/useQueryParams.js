/* eslint-disable react-hooks/exhaustive-deps */
import {
  // React,
  useState,
  useCallback,
  useEffect,
} from 'react';

export const useQueryParams = (errorCB, sid, queryParams) => {
  // queryParams passed as a string are transformed into an object
  const urlParamsObj = Object.fromEntries(
    new URLSearchParams(queryParams),
  );
  const {
    sort,
    order,
    filter,
    filterValue: filterCategory,
  } = urlParamsObj;

  const [accountId, setAccountId] = useState(sid);

  const [userId, setUserId] = useState(0);
  const [sortBy, setSortBy] = useState(sort || 'purchaseDate');
  const [deviceId, setDeviceId] = useState(null);
  const [orderBy, setOrderBy] = useState(order || 'desc');
  const [filterBy, setFilterBy] = useState(filter);
  const [filterValue, setFilterValue] = useState(filterCategory);
  const [page, setPage] = useState(0);

  const [isLoadingQuery, setIsLoadingQuery] = useState(true);

  const handleQueryParams = useCallback(
    (ids, config = {}) => {
      const { ignoreLoading } = config;
      // if a param exists in the url without a value, it will return an empty string (eg: &user alone will return '')
      // if it doesnt exist at all, it returns as null, if it's url encoded it will return "null" as a string

      const {
        account,
        user,
        sort,
        id, // deviceId
        order,
        filter,
        filterValue: fv,
        page: pg,
        error,
      } = ids;

      if (!ignoreLoading) {
        setIsLoadingQuery(true);
      }
      // set the user id
      // TODO ADD account=${sid} similar to orders
      setAccountId(account !== 'null' ? account : sid);
      setUserId(user !== 'null' ? user : 0);
      setDeviceId(id !== 'null' ? id : null);
      setSortBy(sort !== 'null' ? sort : null);
      setOrderBy(order !== 'null' ? order : null);
      setFilterBy(filter !== 'null' ? filter : null);
      setFilterValue(fv !== 'null' ? fv : null);
      setPage(pg !== 'null' ? pg : 0);

      // set the error mode
      if (errorCB) {
        if (error !== 'null') {
          errorCB(error);
        } else {
          errorCB(false);
        }
      }
    },
    [
      sid,
      setDeviceId,
      setAccountId,
      setUserId,
      setSortBy,
      setOrderBy,
      setFilterBy,
      filterValue,
      page,
      // setIsLoadingQuery,
      errorCB,
    ],
  );

  useEffect(() => {
    if (isLoadingQuery) {
      setIsLoadingQuery(false);
    }
  }, [isLoadingQuery]);

  return {
    accountId,
    userId,
    deviceId,
    sortBy,
    orderBy,
    filterBy,
    filterValue,
    page,
    isLoadingQuery,
    handleQueryParams,
  };
};
