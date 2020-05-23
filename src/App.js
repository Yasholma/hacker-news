import React from "react";
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
    };

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
        fetch(
            `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`,
        )
            .then(response => response.json())
            .then(result => this.setSearchTopstories(result))
            .catch(e => e);
    };

    needsToSearchTopStories = searchTerm => !this.state.results[searchTerm];

    componentDidMount = () => {
        const { searchTerm } = this.state;
        this.setState({ searchKey: searchTerm });
        this.fetchSearchTopstories(searchTerm);
    };

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
        const { searchTerm, results, searchKey } = this.state;
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
                <Table list={list} onDismiss={this.onDismiss} />
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
