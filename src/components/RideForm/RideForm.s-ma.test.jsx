import {beforeEach, describe, expect, test, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as util from '../../utilities/FireBase';
// import { ref, onValue, s} from "firebase/database";
// import App from "../App/App";
import RideForm from "./RideForm";
import runAlgorithm from "./RideForm";


describe("Invalid date form test - fail", () => {
    test("date in the past, checking for warning popup", async () => {
        render(<RideForm />);

        const pickupLocation = screen.getByTestId("pickupLoc");
        const dropOffLocation = screen.getByTestId("dropoffLoc");
        const pickupDateE = screen.getByTestId("pickupDateE");
        const pickupTimeE = screen.getByTestId("pickupTimeE");
        const pickupDateL = screen.getByTestId("pickupDateL");
        const pickupTimeL = screen.getByTestId("pickupTimeL");
        const submitForm = screen.getByTestId("submit-button");

        fireEvent.change(pickupLocation, { target: { value: "Allison" } });
        fireEvent.change(dropOffLocation, {target: { value: "Midway" } });
        fireEvent.change(pickupDateE, {target: { value: "2023-01-01" } });
        fireEvent.change(pickupTimeE, { target: { value: "14:00" } });
        fireEvent.change(pickupDateL, {target: { value: "2025-01-01"} });
        fireEvent.change(pickupTimeL, {target: { value: "16:00"} });
        fireEvent.click(submitForm);

        // failure test
        expect(screen.queryByText('Please select a future date')).not.toBeNull();
    });

    test("", () => {

    });

});

describe("Invalid date form test - success", () => {
    test("date not in the past, checking for no warning popup", async () => {
        render(<RideForm />);

        const pickupLocation = screen.getByTestId("pickupLoc");
        const dropOffLocation = screen.getByTestId("dropoffLoc");
        const pickupDateE = screen.getByTestId("pickupDateE");
        const pickupTimeE = screen.getByTestId("pickupTimeE");
        const pickupDateL = screen.getByTestId("pickupDateL");
        const pickupTimeL = screen.getByTestId("pickupTimeL");
        const submitForm = screen.getByTestId("submit-button");

        fireEvent.change(pickupLocation, { target: { value: "Allison" } });
        fireEvent.change(dropOffLocation, {target: { value: "Midway" } });
        fireEvent.change(pickupDateE, {target: { value: "2025-01-01" } });
        fireEvent.change(pickupTimeE, { target: { value: "14:00" } });
        fireEvent.change(pickupDateL, {target: { value: "2025-01-01"} });
        fireEvent.change(pickupTimeL, {target: { value: "16:00"} });
        fireEvent.click(submitForm);

        // failure test
        expect(screen.queryByText('Please select a future date')).toBeNull();
    });

    test("", () => {

    });

});


const mockUser = {
    name : "Steph",
    email: "steph@mock.com"
};
  
const mockUser2 = {
    name : "Bobb",
    email: "bobb@mock.com"
  };

var curr_email = "";

function set(ref, data)
{
    if ( "email" in data ){ 
        expect(data["email"]).toEqual(curr_email);
    }
}

describe("Switch account and submit -- success", () => {
    test("Submit request under different users", async () => {

        const mock = vi.fn().mockImplementation(set);

        vi.spyOn(util, 'useAuthState').mockReturnValue(mockUser);
        var curr_email = mockUser.email;
        render(<RideForm />);
        
        const pickupLocation = screen.getByTestId("pickupLoc");
        const dropOffLocation = screen.getByTestId("dropoffLoc");
        const pickupDateE = screen.getByTestId("pickupDateE");
        const pickupTimeE = screen.getByTestId("pickupTimeE");
        const pickupDateL = screen.getByTestId("pickupDateL");
        const pickupTimeL = screen.getByTestId("pickupTimeL");
        const submitForm = screen.getByTestId("submit-button");
    
        fireEvent.change(pickupLocation, { target: { value: "Allison" } });
        fireEvent.change(dropOffLocation, {target: { value: "Midway" } });
        fireEvent.change(pickupDateE, {target: { value: "2025-01-01" } });
        fireEvent.change(pickupTimeE, { target: { value: "14:00" } });
        fireEvent.change(pickupDateL, {target: { value: "2025-01-01"} });
        fireEvent.change(pickupTimeL, { target: { value: "16:00" } });
        fireEvent.click(submitForm);

        vi.spyOn(util, 'useAuthState').mockReturnValue(mockUser2);
        var curr_email = mockUser2.email;

        fireEvent.change(pickupLocation, { target: { value: "Allison" } });
        fireEvent.change(dropOffLocation, {target: { value: "Midway" } });
        fireEvent.change(pickupDateE, {target: { value: "2025-01-01" } });
        fireEvent.change(pickupTimeE, { target: { value: "14:00" } });
        fireEvent.change(pickupDateL, {target: { value: "2025-01-01"} });
        fireEvent.change(pickupTimeL, { target: { value: "16:00" } });
        fireEvent.click(submitForm);
    });
})
  
describe("Switch account and submit -- fail", () => {
    test("Submit request under same user = same email", async () => {

        const mock = vi.fn().mockImplementation(set);

        vi.spyOn(util, 'useAuthState').mockReturnValue(mockUser);
        var curr_email = mockUser.email;
        render(<RideForm />);
        
        const pickupLocation = screen.getByTestId("pickupLoc");
        const dropOffLocation = screen.getByTestId("dropoffLoc");
        const pickupDateE = screen.getByTestId("pickupDateE");
        const pickupTimeE = screen.getByTestId("pickupTimeE");
        const pickupDateL = screen.getByTestId("pickupDateL");
        const pickupTimeL = screen.getByTestId("pickupTimeL");
        const submitForm = screen.getByTestId("submit-button");
    
        fireEvent.change(pickupLocation, { target: { value: "Allison" } });
        fireEvent.change(dropOffLocation, {target: { value: "Midway" } });
        fireEvent.change(pickupDateE, {target: { value: "2025-01-01" } });
        fireEvent.change(pickupTimeE, { target: { value: "14:00" } });
        fireEvent.change(pickupDateL, {target: { value: "2025-01-01"} });
        fireEvent.change(pickupTimeL, { target: { value: "16:00" } });
        fireEvent.click(submitForm);

        // vi.spyOn(util, 'useAuthState').mockReturnValue(mockUser2);
        // var curr_email = mockUser2.email;

        fireEvent.change(pickupLocation, { target: { value: "Allison" } });
        fireEvent.change(dropOffLocation, {target: { value: "Midway" } });
        fireEvent.change(pickupDateE, {target: { value: "2025-01-01" } });
        fireEvent.change(pickupTimeE, { target: { value: "14:00" } });
        fireEvent.change(pickupDateL, {target: { value: "2025-01-01"} });
        fireEvent.change(pickupTimeL, { target: { value: "16:00" } });
        fireEvent.click(submitForm);
    });
  })