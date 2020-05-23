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
        result: null,
        searchTerm: DEFAULT_QUERY,
    };

    setSearchTopstories = result => {
        const { hits, page } = result;

        const oldHits = page !== 0 ? this.state.result.hits : [];

        const updatedHits = [...oldHits, ...hits];
        this.setState({
            result: { hits: updatedHits, page },
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

    componentDidMount = () => {
        const { searchTerm } = this.state;
        this.fetchSearchTopstories(searchTerm);
    };

    onSearchChange = event => {
        this.setState({ searchTerm: event.target.value });
    };

    onSearchSubmit = event => {
        event.preventDefault();
        const { searchTerm } = this.state;
        this.fetchSearchTopstories(searchTerm);
    };

    onDismiss = id => {
        const isNotId = item => item.objectID !== id;
        const updatedHits = this.state.result.hits.filter(isNotId);
        this.setState({
            result: { ...this.state.result, hits: updatedHits },
        });
    };

    render() {
        const { searchTerm, result } = this.state;
        let page = (result && result.page) || 0;
        console.log(page);

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
                {result && (
                    <Table list={result.hits} onDismiss={this.onDismiss} />
                )}
                <div className='interactions'>
                    <Button
                        onClick={() =>
                            this.fetchSearchTopstories(searchTerm, (page += 1))
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
