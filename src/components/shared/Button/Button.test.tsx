import Button from "./Button";
import {render, screen} from "@testing-library/react";

describe('button', () => {
    it('should display its contents as its label', function () {
        render(<Button>Hello</Button>);
        expect(screen.getByRole("button").textContent).toBe("Hello");
    });
});