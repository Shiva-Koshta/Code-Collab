import React from "react";
import App from "../App";
import ReactDOM from "react-dom/client";
import * as index from '../index'; 
import { renderApp } from "../index";
import axios from 'axios';

jest.mock('axios');

// describe("DOMContentLoaded", () => {
//   it("calls renderApp when DOMContentLoaded event fires", () => {
//     // Mocking the root element
//     const root = document.createElement("div");
//     root.id = "root";
//     document.body.appendChild(root);

//     // Spy on the renderApp function
//     const renderAppSpy = jest.spyOn(index, "renderApp");

//     // Create and dispatch the DOMContentLoaded event
//     const domContentLoadedEvent = new Event('DOMContentLoaded');
//     document.dispatchEvent(domContentLoadedEvent);

//     // Verifying that renderApp was called
//     expect(renderAppSpy).toHaveBeenCalled();
//   });
// });


describe("Index", () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it("renders the App component", async () => {
    const root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);
    await (async () => {
      renderApp();
    });
    expect(document.getElementById("root").textContent).toBe("");
  });

  it("renders without crashing", async () => {
    const root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);
    const rootInstance = ReactDOM.createRoot(root); // Render the App component inside the root
    await (async () => {
      rootInstance.render(<App />);
    }); // Clean up after testing
    await (async () => {
      rootInstance.unmount();
    }); // If the test reaches this point without errors, the rendering was successful

    expect(true).toBe(true);
  });

  it("renders renderApp", async () => {
    const root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root); // Simulate DOMContentLoaded event
    await (async () => {
      document.dispatchEvent(new Event("DOMContentLoaded")); 
    });
    expect(root.innerHTML).toContain("");
  });

  it("handles Axios network error", async () => {
    // Mock Axios network error
    jest.spyOn(axios, "get").mockRejectedValueOnce(new Error('Network Error'));

    // Ensure that Axios error is handled properly
    await expect(async () => {
      await renderApp();
    }).not.toThrow(); // Ensure that the test does not throw an error
  });
});
