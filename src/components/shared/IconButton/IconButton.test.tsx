import {fireEvent, render, screen, waitFor, waitForElementToBeRemoved} from "@testing-library/react";
import IconButton from "./IconButton";

describe('icon button component', () => {
    it('should display a tooltip with the label when hovered', async () => {
        render(<IconButton label="asdf" data-testid="test-button"/>);
        const iconButton = screen.getByTestId("test-button");
        fireEvent.mouseOver(iconButton);
        await waitFor( () => screen.getByText('asdf'));
        const tooltip = screen.getByText('asdf');
        expect(tooltip).toBeInTheDocument();
        fireEvent.mouseLeave(iconButton);
        await waitForElementToBeRemoved(() => screen.getByText('asdf'));
        expect(tooltip).not.toBeInTheDocument();
    });
});