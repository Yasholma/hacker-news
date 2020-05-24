import React from "react";
import Loading from "../components/Loading";

const withLoading = Component => ({ isLoading, ...rest }) =>
    isLoading ? <Loading /> : <Component {...rest} />;

export default withLoading;
