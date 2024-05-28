import {describe, expect, test} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import App from './components/App/App';

describe('counter tests', () => {
    
  test("we should see the submit button for the form", () => {
    render(<App />);
    expect(screen.findAllByText("Submit form")).toBeDefined();
  });


  test("We should see the user logged in", () => {
    render(<App />);
    expect(screen.findAllByText("johnsmith@gmail.com")).toBeDefined();
  });

  test("we should see the delete button for ", () => {
    render(<App />);
    expect(screen.findAllByText("Delete")).toBeDefined();
  });



});

describe("Data Logger", () => {
  test("We should see the request tab", async () => {
    render(<App />);
    const requestsTab = screen.getByText('Request');
    fireEvent.click(requestsTab);
    expect(requestsTab).toBeDefined();
  });

  test("We should see the Matches tab", async () => {
    render(<App />);
    const matchesTab = screen.getByText('Matches');
    fireEvent.click(matchesTab);
    expect(matchesTab).toBeDefined();
  });

  test("We should be able to see matches", async () => {
    render(<App />);
    const matchesTab = await screen.getByText('Matches');
    fireEvent.click(matchesTab);
    expect(matchesTab).toBeDefined();
  });

});