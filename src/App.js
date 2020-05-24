import React from "react";
import axios from "axios";
import Search from "./components/Search";
import Table from "./components/Table";

import "./App.css";
import Button from "./components/Button";

const DEFAULT_QUERY = "redux";
const DEFAULT_HPP = 100;
const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";

class App extends React.Component {
    state = {
        results: null,
        searchTerm: DEFAULT_QUERY,
        searchKey: "",
        error: null,
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
        });
    };

    fetchSearchTopstories = (searchTerm, page = 0) => {
        axios(
            `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`,
        )
            .then(
                result =>
                    this._isMounted && this.setSearchTopstories(result.data),
            )
            .catch(e => this._isMounted && this.setState({ error: e }));
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
        const { searchTerm, results, searchKey, error } = this.state;
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
                    <Button
                        onClick={() =>
                            this.fetchSearchTopstories(searchKey, (page += 1))
                        }
                    >
                        More
                    </Button>
                </div>
            </div>
        );
    }
}

export default App;
