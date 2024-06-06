import { beforeEach, describe, expect, test, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "./components/App/App";
import * as util from './utilities/FireBase';
import { useState } from 'react';

describe("test if correct email is automatically saved in request data when submitting the request form", () => {
  

  

  test("let's mock a sign in, submit a request, and check the email", async () => {
    await render(<App />);
    const mockUser = {
        name: "Ege",
        email: "Ege@mock.com"
      };
    vi.spyOn(util, 'useAuthState').mockReturnValue([mockUser]);

    const submit = screen.getByTestId("submit-button");
    const dateStart = screen.getByTestId("pickupDateE");
    const timeStart = screen.getByTestId("pickupTimeE");
    const dateEnd = screen.getByTestId("pickupDateL");
    const timeEnd = screen.getByTestId("pickupTimeL");
    const pickupLocation = screen.getByTestId("pickupLoc");
    const dropOffLocation = screen.getByTestId("dropoffLoc");

    fireEvent.change(pickupLocation, { target: { value: "Tech" } });
    fireEvent.change(dropOffLocation, { target: { value: "OHare" } });
    fireEvent.change(dateStart, { target: { value: "2024-06-01" } });
    fireEvent.change(timeStart, { target: { value: "08:00" } });
    fireEvent.change(dateEnd, { target: { value: "2024-06-01" } });
    fireEvent.change(timeEnd, { target: { value: "10:00" } });
    fireEvent.click(submit);
    
    
    // There needs to be two instances of the email value on the screen, one for the authenticated user and other for the request data
    const emailInstances = await screen.findAllByText("Ege@mock.com");
    
    expect(emailInstances.length).toBe(2);
  });
});