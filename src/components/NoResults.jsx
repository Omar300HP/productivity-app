import React, { Fragment } from "react";

import no_results from "../images/nothing-found.png";

export default function NoResults() {
  return (
    <Fragment>
      <img src={no_results} alt="no_results" style={{ width: "100px" }} />
      <h4>نتيجة البحث فارغة</h4>
    </Fragment>
  );
}
