import React from "react";
import axios from "axios";
import Search from "../Search";
import Table from "../Table";
import Button from "../Buttons";

import "./index.css";
import {
    DEFAULT_QUERY,
    PARAM_HPP,
    PARAM_SEARCH,
    PATH_BASE,
    DEFAULT_HPP,
    PARAM_PAGE,
    PATH_SEARCH,
} from "./../../constants";
import Loading from "../Loading";
import { withLoading } from "../../hoc";

const ButtonWithLoading = withLoading(Button);

class App extends React.Component {
    state = {
        results: null,
        searchTerm: DEFAULT_QUERY,
        searchKey: "",
        error: null,
        isLoading: false,
    };

    _isMounted = false;

    setSearchTopstories = result => {
        const { hits, page } = result;
        const { searchKey, results } = this.state;

        const oldHits =
            results && results[searchKey] ? results[searchKey].hits : [];

        const updatedHits = [...oldHits, ...hits];
        this.setState({
            results: { ...results, [searchKey]: { hits: updatedHits, page } },
            isLoading: false,
        });
    };

    fetchSearchTopstories = (searchTerm, page = 0) => {
        this.setState({ isLoading: true });
        axios(
            `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`,
        )
            .then(
                result =>
                    this._isMounted && this.setSearchTopstories(result.data),
            )
            .catch(
                e =>
                    this._isMounted &&
                    this.setState({ error: e, isLoading: false }),
            );
    };

    needsToSearchTopStories = searchTerm => !this.state.results[searchTerm];

    componentDidMount = () => {
        this._isMounted = true;
        const { searchTerm } = this.state;
        this.setState({ searchKey: searchTerm });
        this.fetchSearchTopstories(searchTerm);
    };

    componentWillUnmount() {
        this._isMounted = false;
    }

    onSearchChange = event => {
        this.setState({ searchTerm: event.target.value });
    };

    onSearchSubmit = event => {
        event.preventDefault();
        const { searchTerm } = this.state;
        this.setState({ searchKey: searchTerm });
        if (this.needsToSearchTopStories(searchTerm)) {
            this.fetchSearchTopstories(searchTerm);
        }
    };

    onDismiss = id => {
        const { searchKey, results } = this.state;
        const { hits, page } = results[searchKey];
        const isNotId = item => item.objectID !== id;
        const updatedHits = hits.filter(isNotId);
        this.setState({
            results: { ...results, [searchKey]: { hits: updatedHits, page } },
        });
    };

    render() {
        const { searchTerm, results, searchKey, error, isLoading } = this.state;
        let page =
            (results && results[searchKey] && results[searchKey].page) || 0;
        const list =
            (results && results[searchKey] && results[searchKey].hits) || [];

        return (
            <div className='page'>
                <div className='interactions'>
                    <Search
                        value={searchTerm}
                        onChange={this.onSearchChange}
                        onSubmit={this.onSearchSubmit}
                    >
                        Search
                    </Search>
                </div>
                {!error ? (
                    <Table list={list} onDismiss={this.onDismiss} />
                ) : (
                    <div className='interactions'>
                        <p>Something went wrong.</p>
                    </div>
                )}
                <div className='interactions'>
                    <ButtonWithLoading
                        isLoading={isLoading}
                        onClick={() =>
                            this.fetchSearchTopstories(searchKey, (page += 1))
                        }
                    >
                        More
                    </ButtonWithLoading>
                </div>
            </div>
        );
    }
}

export default App;
