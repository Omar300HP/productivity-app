// api function create an axios instance to be used globally in any api request

import axios from "axios";

export const instance = axios.create({
  baseURL: "http://107.170.89.77/wodooh_be/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const APILink = "http://";
export const MEDIALink = "http://";

export const APICalls = {
  getDevices: function (params) {
    return instance.get(APILink + "device/", {
      params: params,
    });
  },
  makeLookup: function (params) {
    return instance.post(APILink + "lookup/", params);
  },
  updateLookup: function (id, params) {
    return instance.patch(APILink + "lookup/" + id + "/", params);
  },
};
