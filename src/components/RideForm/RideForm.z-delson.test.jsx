import {beforeEach, describe, expect, test, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "../App/App";
import { deleteField } from "firebase/firestore";

describe("Form submission test", () => {
    test("submitting the form with valid data", async () => {
        render(<App />);

        const pickupLocation = screen.getByTestId("pickupLoc");
        const dropOffLocation = screen.getByTestId("dropoffLoc");
        const pickupDateE = screen.getByTestId("pickupDateE");
        const pickupTimeE = screen.getByTestId("pickupTimeE");
        const pickupDateL = screen.getByTestId("pickupDateL");
        const pickupTimeL = screen.getByTestId("pickupTimeL");
        const submitForm = screen.getByTestId("submit-button");

        fireEvent.change(pickupLocation, {target: { value: "Tech" } });
        fireEvent.change(dropOffLocation, {target: { value: "Ohare" } });
        fireEvent.change(pickupDateE, {target: { value: "2024-02-10" } });
        fireEvent.change(pickupTimeE, {target: { value: "4:30"} });
        fireEvent.change(pickupDateL, {target: { value: "2024-02-10"} });
        fireEvent.change(pickupTimeL, {target: { value: "2:10"} });
        fireEvent.click(submitForm);
        fireEvent.click(deleteField)
        expect(screen.queryByText('Error')).toBeNull();
        expect(screen.getByText('Error: Invalid input')).toBeInTheDocument();

    });

    test("", () => {

    });

});