import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import About from "../pages/About";
import Faq from "../pages/Faq";
import HelpPage from "../pages/HelpPage";

describe("Login component", () => {
  test("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  });

  test("calls googleAuth function when GoogleButton is clicked", () => {
    const googleAuthMock = jest.fn();
    window.open = googleAuthMock;

    const { getByText } = render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const googleButton = getByText("Sign in with Google");
    fireEvent.click(googleButton);

    expect(googleAuthMock).toHaveBeenCalled();
  });
  test("renders About component when '/about-us' URL is called", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/about-us']}>
        <Routes>
          <Route path='/about-us' element={<About />} />
        </Routes>
      </MemoryRouter>
    );
  });
  test("renders Faq component when /Faq URL is called", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/Faq"]}>
        <Routes>
          <Route path="/Faq" element={<Faq />} />
        </Routes>
      </MemoryRouter>
    );
  });
  test("renders HelpPage component when /help URL is called", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/help"]}>
        <Routes>
          <Route path="/help" element={<HelpPage />} />
        </Routes>
      </MemoryRouter>
    );
  });
});
