import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Navbar from "./NavBar";

describe("Navbar Component - Integration Tests", () => {

  // Helper to render Navbar with routes for integration testing
  const renderWithRouter = (initialRoute = "/") => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Navbar />
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/search" element={<div>Search Page</div>} />
          <Route path="/compare" element={<div>Compare Page</div>} />
          <Route path="/profile" element={<div>Profile Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("applies active class to current route link", () => {
    renderWithRouter("/compare");

    const compareLink = screen.getByText("Compare");
    const homeLink = screen.getByText("Home");

    expect(compareLink.className).toMatch(/border-b-2/);
    expect(homeLink.className).not.toMatch(/border-b-2/);
  });

  it("navigates to Search page when Search link is clicked", () => {
    renderWithRouter("/");

    fireEvent.click(screen.getByText("Search"));

    expect(screen.getByText("Search Page")).toBeInTheDocument();
    const searchLink = screen.getByText("Search");
    expect(searchLink.className).toMatch(/border-b-2/);
  });

  it("navigates to Compare page when Compare link is clicked", () => {
    renderWithRouter("/search");

    fireEvent.click(screen.getByText("Compare"));

    expect(screen.getByText("Compare Page")).toBeInTheDocument();
    expect(screen.getByText("Compare").className).toMatch(/border-b-2/);
  });

  it("navigates to Profile page when Profile link is clicked", () => {
    renderWithRouter("/");

    fireEvent.click(screen.getByText("Profile"));

    expect(screen.getByText("Profile Page")).toBeInTheDocument();
  });

  it("navigates to Home page when clicking the logo", () => {
    renderWithRouter("/compare");

    fireEvent.click(screen.getByLabelText("Home"));
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });
});