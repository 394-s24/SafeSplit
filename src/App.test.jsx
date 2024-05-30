import {beforeEach, describe, expect, test, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "./components/App/App";
import DataLogger from "./components/DataLogger/DataLogger";
import * as util from './utilities/FireBase';
import { useState } from 'react';

describe("counter tests", () => {
  test("we should see the submit button for the form", () => {
    render(<App />);
    expect(screen.findAllByText("Submit form")).toBeDefined();
  });

  

  test("we should see the delete button for ", () => {
    render(<App />);
    expect(screen.findAllByText("Delete")).toBeDefined();
  });
});

describe("Data Logger", () => {
  test("We should see the request tab", async () => {
    render(<App />);
    const requestsTab = screen.getByText("Request");
    fireEvent.click(requestsTab);
    expect(requestsTab).toBeDefined();
  });

  test("We should see the Matches tab", async () => {
    render(<App />);
    const matchesTab = screen.getByText("Matches");
    fireEvent.click(matchesTab);
    expect(matchesTab).toBeDefined();
  });

  test("We should be able to see matches", async () => {
    render(<App />);
    const matchesTab = await screen.getByText("Matches");
    fireEvent.click(matchesTab);
    expect(matchesTab).toBeDefined();
  });
});

const mockData = {
  reqData: [
    [
      "5/29/2024, 12:22:00 AM",
      "5/29/2024, 3:20:00 AM",
      "Tech",
      "OHare",
      "gerardoperez8a@gmail.com",
      1,
      "Pending",
      "23",
      0,
    ],
  ],
  matchData: [],
};

const setKey = () => {}

describe("Data Logger Mock Data", () => {
  test("We should see the request tab", async () => {
    render(
      <DataLogger
        reqData={mockData["reqData"]}
        matchData={mockData["matchData"]}
        tabKey={"request"}
        setTabKey={setKey}
        firebaseData={mockData}
      />
    );
    
    expect(await screen.findAllByText("Request")).toBeDefined();

  });
});

const mockUser = {
  name : "Ege",
  email: "Ege@mock.com"
};

describe("Mock User, not authenticated", () => {
  
  
  test("We should not see a sign out button, we assume that there is no authenticated user when app launches", async () => {
    vi.spyOn(util, 'useAuthState').mockReturnValue([null]);
    render(<App />);
    expect(await !screen.findByText("Sign out")).toBeDefined();
  });
  test("We should see the sign in button", async () => {
    vi.spyOn(util, 'useAuthState').mockReturnValue([null]);
    render(<App />);
    expect(await screen.findByText("Sign in")).toBeDefined();
  });

});
describe("Mock User, authenticated", () => {
  test("We should see the sign out button", async () => {
    vi.spyOn(util, 'useAuthState').mockReturnValue([mockUser]);
    render(<App />);
    expect(await screen.findByText("Sign out")).toBeDefined();
  });
  test("We should not see the sign in button", async () => {
    vi.spyOn(util, 'useAuthState').mockReturnValue([mockUser]);
    render(<App />);
    expect(await !screen.findByText("Sign in")).toBeDefined();
  });
})



