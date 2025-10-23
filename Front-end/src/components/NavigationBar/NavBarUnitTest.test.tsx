// Navbar.test.tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./NavBar";

describe("Navbar Component (Unit Tests)", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    // Check the root element
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders logo link to home", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    const logo = screen.getByLabelText("Home");
    expect(logo).toBeInTheDocument();
    expect(logo.getAttribute("href")).toBe("/"); // correct route
  });

  it("renders all main navigation links", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Check each nav item
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
    expect(screen.getByText("Compare")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("each link has the correct href", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText("Home").getAttribute("href")).toBe("/");
    expect(screen.getByText("Search").getAttribute("href")).toBe("/search");
    expect(screen.getByText("Compare").getAttribute("href")).toBe("/compare");
    expect(screen.getByText("Profile").getAttribute("href")).toBe("/profile");
  });

  it("does not apply active class when route does not match", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Navbar />
      </MemoryRouter>
    );

    const searchLink = screen.getByText("Search");
    expect(searchLink.className).not.toMatch(/border-b-2/); // not active
  });
});
