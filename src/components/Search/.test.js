import React from "react";
import { render } from "@testing-library/react";
import Search from ".";
import renderer from "react-test-renderer";

describe("Search", () => {
    test("should render without crashing", () => {
        const div = document.createElement("div");
        render(<Search />, div);
    });
    test("has a valid snapshot", () => {
        const component = renderer.create(<Search />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
