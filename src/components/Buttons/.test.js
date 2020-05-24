import React from "react";
import { render } from "@testing-library/react";
import Button from ".";
import renderer from "react-test-renderer";

describe("Button", () => {
    it("renders without crashing", () => {
        const div = document.createElement("div");
        render(<Button>Give Me More</Button>, div);
    });

    test("has a valid snapshot", () => {
        const component = renderer.create(<Button>Give Me More</Button>);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
