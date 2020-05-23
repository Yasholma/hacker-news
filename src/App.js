import React from "react";
import Search from "./components/Search";
import Table from "./components/Table";

import "./App.css";

const DEFAULT_QUERY = "redux";
const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";

class App extends React.Component {
    state = {
        result: null,
        searchTerm: DEFAULT_QUERY,
    };

    setSearchTopstories = result => {
        this.setState({ result });
    };

    fetchSearchTopstories = searchTerm => {
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
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
            </div>
        );
    }
}

export default App;
