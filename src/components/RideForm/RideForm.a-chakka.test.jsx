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

    test("", () => {

    });

});