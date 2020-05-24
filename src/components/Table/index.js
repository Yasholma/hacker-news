import React from "react";
import Button from "../Buttons";
import Sort from "../Sort";

import { sortBy } from "lodash";

const SORTS = {
    NONE: list => list,
    TITLE: list => sortBy(list, "title"),
    AUTHOR: list => sortBy(list, "author"),
    COMMENTS: list => sortBy(list, "comments").reverse(),
    POINTS: list => sortBy(list, "points").reverse(),
};

class Table extends React.Component {
    state = {
        sortKey: "NONE",
        isSortReverse: false,
    };

    onSort = sortKey => {
        const isSortReverse =
            this.state.sortKey === sortKey && !this.state.isSortReverse;
        this.setState({ sortKey, isSortReverse });
    };

    render() {
        const { list, onDismiss } = this.props;
        const { sortKey, isSortReverse } = this.state;
        const reversedSortList = isSortReverse ? list.reverse() : list;
        return (
            <div className='table'>
                <div className='table-header'>
                    <span style={{ width: "40%" }}>
                        <Sort
                            activeSortKey={sortKey}
                            sortKey={"TITLE"}
                            onSort={this.onSort}
                        >
                            Title
                        </Sort>
                    </span>
                    <span style={{ width: "30%" }}>
                        <Sort
                            activeSortKey={sortKey}
                            sortKey={"AUTHOR"}
                            onSort={this.onSort}
                        >
                            Author
                        </Sort>
                    </span>
                    <span style={{ width: "10%" }}>
                        <Sort
                            activeSortKey={sortKey}
                            sortKey={"COMMENTS"}
                            onSort={this.onSort}
                        >
                            Comments
                        </Sort>
                    </span>
                    <span style={{ width: "10%" }}>
                        <Sort
                            activeSortKey={sortKey}
                            sortKey={"POINTS"}
                            onSort={this.onSort}
                        >
                            Points
                        </Sort>
                    </span>
                    <span style={{ width: "10%" }}>Archive</span>
                </div>
                {SORTS[sortKey](reversedSortList).map(item => (
                    <div key={item.objectID} className='table-row'>
                        <span style={{ width: "40%" }}>
                            <a href={item.url}>{item.title}</a>
                        </span>
                        <span style={{ width: "30%" }}>{item.author}</span>
                        <span style={{ width: "10%" }}>
                            {item.num_comments}
                        </span>
                        <span style={{ width: "10%" }}>{item.points}</span>
                        <span style={{ width: "10%" }}>
                            <Button
                                onClick={() => onDismiss(item.objectID)}
                                className='button-inline'
                            >
                                Dismiss
                            </Button>
                        </span>
                    </div>
                ))}
            </div>
        );
    }
}

export default Table;
