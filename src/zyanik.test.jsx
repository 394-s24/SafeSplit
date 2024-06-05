import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./components/App/App";
import DataLogger from "./components/DataLogger/DataLogger";
import * as util from "./utilities/FireBase";

describe("Form Tests", () => {
  test("Test error handling when the end date is before the start date", async () => {
    render(<App />);

    const pickupLocation = screen.getByTestId("pickupLoc");
    const dropOffLocation = screen.getByTestId("dropoffLoc");
    const pickupDateE = screen.getByTestId("pickupDateE");
    const pickupTimeE = screen.getByTestId("pickupTimeE");
    const pickupDateL = screen.getByTestId("pickupDateL");
    const pickupTimeL = screen.getByTestId("pickupTimeL");
    const submitForm = screen.getByTestId("submit-button");

    fireEvent.change(pickupLocation, { target: { value: "" } });
    fireEvent.change(dropOffLocation, { target: { value: "" } });
    fireEvent.change(pickupDateE, { target: { value: "2025-01-10" } });
    fireEvent.change(pickupTimeE, { target: { value: "12:00 PM" } });
    fireEvent.change(pickupDateL, { target: { value: "2025-01-01" } });
    fireEvent.change(pickupTimeL, { target: { value: "5:00 PM" } });
    fireEvent.click(submitForm);

    expect(
      screen.queryByText(
        "Earliest pickup date must be before latest pickup date"
      )
    ).toBeDefined();
  });

  test("Test valid form input for the date", async () => {
    render(<App />);

    const pickupLocation = screen.getByTestId("pickupLoc");
    const dropOffLocation = screen.getByTestId("dropoffLoc");
    const pickupDateE = screen.getByTestId("pickupDateE");
    const pickupTimeE = screen.getByTestId("pickupTimeE");
    const pickupDateL = screen.getByTestId("pickupDateL");
    const pickupTimeL = screen.getByTestId("pickupTimeL");
    const submitForm = screen.getByTestId("submit-button");

    fireEvent.change(pickupLocation, { target: { value: "" } });
    fireEvent.change(dropOffLocation, { target: { value: "" } });
    fireEvent.change(pickupDateE, { target: { value: "2025-01-10" } });
    fireEvent.change(pickupTimeE, { target: { value: "12:00 PM" } });
    fireEvent.change(pickupDateL, { target: { value: "2025-01-10" } });
    fireEvent.change(pickupTimeL, { target: { value: "5:00 PM" } });
    fireEvent.click(submitForm);

    expect(
      !screen.queryByText(
        "Earliest pickup date must be before latest pickup date"
      )
    ).toBeDefined();
  });
});

const mockUser = {
  name: "Gerardo",
  email: "gerardo@gmail.com",
};

describe("DataLogger Component", () => {
  beforeEach(() => {
    // Mock any external dependencies here, such as network requests
    vi.mock("../../utilities/FireBase.js", () => ({
      FetchData: vi.fn(() => Promise.resolve({ requests: [], matches: [] })),
      formatData: vi.fn(() => ({
        foundMaxMatchId: 1,
        foundMaxRequestId: 1,
        reqData: [
          {
            dateStart: "5/29/2024, 12:22:00 AM",
            dateEnd: "5/29/2024, 3:20:00 AM",
            category: "Tech",
            locationFrom: "OHare",
            email: "gerardo@gmail.com",
            status: "Pending",
            age: 23,
            id: 0,
          },
        ],
        matchData: [
          {
            dateStart: "6/8/2024, 11:45:00 AM",
            dateEnd: "6/8/2024, 12:00:00 PM",
            locationFrom: "Lincoln",
            locationTo: "OHare",
            emails: [
              "gerardo@gmail.com",
              "gracehopper@gmail.com",
              "janedoe@gmail.com",
            ],
            id: 1,
          },
        ],
      })),
    }));
  });

  it('changes tab when clicking on the "Matches" tab', async () => {
    const setTabKey = vi.fn();
    const props = {
      matchData: [
        [
          "6/8/2024, 11:45:00 AM",
          "6/8/2024, 12:00:00 PM",
          "Lincoln",
          "OHare",
          ["gerardo@gmail.com", "gracehopper@gmail.com", "janedoe@gmail.com"],
          1,
        ],
      ],
      reqData: [
        [
          "5/29/2024, 12:22:00 AM",
          "5/29/2024, 3:20:00 AM",
          "Tech",
          "OHare",
          "gerardo@gmail.com",
          1,
          "Pending",
          "23",
          0,
        ],
      ],
      tabKey: "request",
      setTabKey,
      firebaseData: { requests: [], matches: [] },
    };

    const { container } = render(<DataLogger {...props}/>);

    // Check that the initial content is rendered
    await screen.findByText("Riders: 1");

    // Simulate clicking on the "Matches" tab
    fireEvent.click(screen.getByRole("tab", { name: /matches/i }));

    // Expect the setTabKey to have been called with 'matches'
    expect(setTabKey).toHaveBeenCalledWith("matches");

    // Log the entire container
    console.log(container.innerHTML);

    // Use findByText to wait for the appearance of an email from the match data
    const matchContent = await screen.findByText("janedoe@gmail.com");
    expect(matchContent).toBeDefined();
  });

  // Other tests as needed for additional interactions
});