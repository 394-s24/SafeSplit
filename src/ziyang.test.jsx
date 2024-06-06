import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./components/App/App";
import DataLogger from "./components/DataLogger/DataLogger";
import '@testing-library/jest-dom/vitest';
import RideForm from "./components/RideForm/RideForm";

describe(" request with start time before end time", () => {
    test("Test when start time before end time", async () => {
      render(<App />);
  
      const pickupLocation = screen.getByTestId("pickupLoc");
      const dropOffLocation = screen.getByTestId("dropoffLoc");
      const pickupDateE = screen.getByTestId("pickupDateE");
      const pickupTimeE = screen.getByTestId("pickupTimeE");
      const pickupDateL = screen.getByTestId("pickupDateL");
      const pickupTimeL = screen.getByTestId("pickupTimeL");
      const submitForm = screen.getByTestId("submit-button");
  
      fireEvent.change(pickupLocation, { target: { value: "Tech" } });
      fireEvent.change(dropOffLocation, { target: { value: "OHare" } });
      fireEvent.change(pickupDateE, { target: { value: "2024-06-29" } });
      fireEvent.change(pickupTimeE, { target: { value: "5:00 AM" } });
      fireEvent.change(pickupDateL, { target: { value: "2024-06-29" } });
      fireEvent.change(pickupTimeL, { target: { value: "5:00 PM" } });
      fireEvent.click(submitForm);
  
      expect(
        screen.queryByText(
          "Please select a future date"
        )
      ).toBeNull();

    });

    
    });

    
describe("Invalid request with start time after end time", () => {
    test("Test when start time after end time", async () => {
        render(<App />);
      
        const pickupLocation = screen.getByTestId("pickupLoc");
        const dropOffLocation = screen.getByTestId("dropoffLoc");
        const pickupDateE = screen.getByTestId("pickupDateE");
        const pickupTimeE = screen.getByTestId("pickupTimeE");
        const pickupDateL = screen.getByTestId("pickupDateL");
        const pickupTimeL = screen.getByTestId("pickupTimeL");
        const submitForm = screen.getByTestId("submit-button");
      
        fireEvent.change(pickupLocation, { target: { value: "Tech" } });
        fireEvent.change(dropOffLocation, { target: { value: "OHare" } });
        fireEvent.change(pickupDateE, { target: { value: "2024-06-29" } });
        fireEvent.change(pickupTimeE, { target: { value: "5:00 PM" } });
        fireEvent.change(pickupDateL, { target: { value: "2024-06-29" } });
        fireEvent.change(pickupTimeL, { target: { value: "5:00 AM" } });
        fireEvent.click(submitForm);
      
        expect(
        screen.queryByText(
            "Please select a future date"
        )
        ).toBeNull()
    
    });
    
        
});
    
describe("Tests whether the matches are being displayed when matches exist.", () => {
            
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
               // const matchContent3 = await screen.findByText("johnsmith@gmail.com");
               // expect(matchContent3).toBeInTheDocument();
            
              });

});