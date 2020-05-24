import React from "react";
import { render } from "@testing-library/react";
import App from ".";
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
});
