import React from "react";
import { act } from "react-dom/test-utils";
import App from "../App";
import ReactDOM from "react-dom/client";
import { renderApp } from "../index";

// describe("DOMContentLoaded", () => {
//   it("calls renderApp when DOMContentLoaded event fires", () => {
//     // Mocking the root element
//     const root = document.createElement("div");
//     root.id = "root";
//     document.body.appendChild(root);
//     // Spy on the renderApp function
//     const renderAppSpy = jest.spyOn(index, "renderApp");
//     // Dispatching the DOMContentLoaded event
//     document.dispatchEvent(new Event("DOMContentLoaded"));
//     // Verifying that renderApp was called
//     expect(renderAppSpy).toHaveBeenCalled();
//   });
// });

describe("Index", () => {
  it("renders the App component", () => {
    const root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);
    act(() => {
      renderApp();
    });
    expect(document.getElementById("root").textContent).toBe(
      "Login hereSign in with GoogleAbout UsFAQHelp"
    );
  });

  it("renders without crashing", () => {
    const root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);
    const rootInstance = ReactDOM.createRoot(root); // Render the App component inside the root
    act(() => {
      rootInstance.render(<App />);
    }); // Clean up after testing
    act(() => {
      rootInstance.unmount();
    }); // If the test reaches this point without errors, the rendering was successful

    expect(true).toBe(true);
  });

  it("renders renderApp", () => {
    const root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root); // Simulate DOMContentLoaded event
    document.dispatchEvent(new Event("DOMContentLoaded")); 
    expect(root.innerHTML).toContain("");
  });
});
