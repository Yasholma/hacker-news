import React from "react";
import { render } from "@testing-library/react";
import App, { updateSearchTopStoriesState } from ".";
import renderer from "react-test-renderer";

describe("App", () => {
    test("should render without crashing", () => {
        const div = document.createElement("div");
        render(<App />, div);
    });
    test("has a valid snapshot", () => {
        const component = renderer.create(<App />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    test("should updateSearchTopStoriesState to produce a new object", () => {
        const state = {
            results: {
                redux: { hits: [{ title: "hello", objectID: 2 }] },
            },
            searchKey: "redux",
        };

        const page = 2;
        const hits = [{ title: "some more", objectID: 3 }];

        const updated = [...state.results["redux"].hits, ...hits];

        const expectedResult = {
            results: {
                ...state.results,
                redux: { hits: updated, page },
            },
            isLoading: false,
        };

        expect(updateSearchTopStoriesState(hits, 2)(state)).toEqual(
            expectedResult,
        );
    });
});
