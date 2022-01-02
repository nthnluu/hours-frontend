import AccountMenu from "./AccountMenu";
import {render, screen, waitFor} from "@testing-library/react";
import {testUser} from "../../../util/auth/auth_helpers";

describe('account menu', () => {
    it('should display an avatar with initials if no image is available', () => {
        render(<AccountMenu user={testUser({image: ""})}/>);
        expect(screen.getByText("NB")).toBeInTheDocument();
    });

    it('should display the profile picture of the user if provided', () => {
        render(<AccountMenu user={testUser()}/>);
        expect(screen.getByRole("button").firstElementChild!.firstElementChild!.getAttribute("src"))
            .toBe("/sample_avatar.jpg");
    });

    it('should display the menu when the account button is clicked', async () => {
        const expectedElements: {
            type: "text" | "button";
            text: string;
        }[] = [
            {type: "text", text: testUser().name},
            {type: "text", text: testUser().email},
            {type: "button", text: "Sign out"},
            {type: "button", text: "Manage account"}];

        render(<AccountMenu user={testUser()}/>);

        // Check that the expected items are hidden when the menu is closed
        expectedElements.forEach(elem => expect(screen.queryByText(elem.text)).toBeNull());

        // Open the menu
        screen.getByRole("button").click();
        await waitFor(() => screen.queryByText(testUser().name));

        // Check that the expected items displayed when the menu is open
        expectedElements.forEach(elem => {
            if (elem.type === "text") {
                expect(screen.queryByText(elem.text)).toBeInTheDocument();
            } else if (elem.type === "button") {
                const button = screen.queryByText(elem.text);
                expect(button).toBeInTheDocument();
                expect(button).toBeEnabled();
            }
        });
    });
});
