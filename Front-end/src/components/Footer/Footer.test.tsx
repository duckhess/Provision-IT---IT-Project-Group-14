import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";

describe("Footer Component - Unit Tests", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
  });

  it("renders the footer element", () => {
    // Footer should be rendered
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders contact information in the left column", () => {
    expect(screen.getByText(/Email: info@defying.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Phone: 0420-911-696/i)).toBeInTheDocument();
    expect(screen.getByText(/Fax: 0420-911-696/i)).toBeInTheDocument();
  });

  it("renders middle column navigation links with correct hrefs", () => {
    const homeLink = screen.getByText("Home Page");
    const searchLink = screen.getByText("Search Page");
    const compareLink = screen.getByText("Compare Page");

    expect(homeLink).toHaveAttribute("href", "/");
    expect(searchLink).toHaveAttribute("href", "/search");
    expect(compareLink).toHaveAttribute("href", "/compare");
  });

  it("renders right column navigation links with correct hrefs", () => {
    const profileLink = screen.getByText("Profile Page");
    const loginLink = screen.getByText("Login Page");
    const aboutLink = screen.getByText("About Page");

    expect(profileLink).toHaveAttribute("href", "/profile");
    expect(loginLink).toHaveAttribute("href", "/login");
    expect(aboutLink).toHaveAttribute("href", "#");
  });
});
