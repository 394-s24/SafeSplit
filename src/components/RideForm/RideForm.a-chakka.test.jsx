import {beforeEach, describe, expect, test, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "../App/App";

describe("Form Tests", () => {
    test("submits the form with invalid data", async () => {
        render(<App />);

        const pickupLocation = screen.getByTestId("pickupLoc");
        const dropOffLocation = screen.getByTestId("dropoffLoc");
        const pickupDateE = screen.getByTestId("pickupDateE");
        const pickupTimeE = screen.getByTestId("pickupTimeE");
        const pickupDateL = screen.getByTestId("pickupDateL");
        const pickupTimeL = screen.getByTestId("pickupTimeL");
        const submitForm = screen.getByTestId("submit-button");

        fireEvent.change(pickupLocation, {target: { value: "" } });
        fireEvent.change(dropOffLocation, {target: { value: "" } });
        fireEvent.change(pickupDateE, {target: { value: "2023-07-10" } });
        fireEvent.change(pickupTimeE, {target: { value: "2:00"} });
        fireEvent.change(pickupDateL, {target: { value: "2023-07-01"} });
        fireEvent.change(pickupTimeL, {target: { value: "4:00"} });
        fireEvent.click(submitForm);
        
        expect(screen.queryByText('Please')).toBeNull();
    });
});

describe("Tests whether the matches are being displayed if matches exist.", () => {
            
            it("displays matches when match data is provided", async () => {
                const setTabKey = vi.fn();
                const props = {
                  matchData: [
                    [
                      "6/29/2024, 5:30:00 AM",
                      "6/29/2024, 5:00:00 PM",
                      "Lincoln",
                      "OHare",
                      ["johnsmith@gmail.com", "gracehopper@gmail.com", "janedoe@gmail.com"],
                      0,
                    ],
                  ],
                  reqData: [
                    [
                      "6/29/2024, 5:00:00 AM",
                      "6/29/2024, 5:00:00 PM",
                      "Lincoln",
                      "OHare",
                      "johnsmith@gmail.com",
                      1,
                      "Matched",
                      "20",
                      0,
                    ],
                  ],
                  tabKey: "request",
                  setTabKey,
                  firebaseData: { requests: [], matches: [] },
                };
            
                const { container } = render(<DataLogger {...props} />);
            
                await screen.findByText("Riders: 1");
            
                // Simulate clicking on the "Matches" tab
                fireEvent.click(screen.getByRole("tab", { name: /matches/i }));
            
                // Expect the setTabKey to have been called with 'matches'
                expect(setTabKey).toHaveBeenCalledWith("matches");
            
                // Check that the match content is rendered
                const matchContent = await screen.findByText("janedoe@gmail.com");
                expect(matchContent).toBeInTheDocument();
                const matchContent2 = await screen.findByText("gracehopper@gmail.com");
                expect(matchContent2).toBeInTheDocument(); 
              });

});
