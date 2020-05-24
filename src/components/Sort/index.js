import React from "react";
import Button from "../Buttons";

const Sort = ({ sortKey, onSort, children, activeSortKey }) => (
    <Button
        className={`button-inline ${
            activeSortKey === sortKey && "button-active"
        }`}
        onClick={() => onSort(sortKey)}
    >
        {children}
    </Button>
);

export default Sort;
