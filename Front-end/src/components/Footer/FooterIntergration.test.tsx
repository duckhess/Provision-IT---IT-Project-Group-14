import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Footer from "./Footer";
import React from "react";

// Mock page components for routing tests
const Home = () => <h1>Home Page</h1>;
const Search = () => <h1>Search Page</h1>;
const Compare = () => <h1>Compare Page</h1>;
const Profile = () => <h1>Profile Page</h1>;
const Login = () => <h1>Login Page</h1>;

describe("Footer Component - Integration Tests", () => {
  const setup = (initialPath = "/") => {
    render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer />
      </MemoryRouter>
    );
  };

  it("navigates to Home Page when 'Home Page' link is clicked", () => {
    setup("/search");

    const homeLink = screen.getByRole("link", { name: "Home Page" });
    fireEvent.click(homeLink);

    expect(screen.getByRole("heading", { name: "Home Page" })).toBeInTheDocument();
  });

  it("navigates to Search Page when 'Search Page' link is clicked", () => {
    setup("/");

    const searchLink = screen.getByRole("link", { name: "Search Page" });
    fireEvent.click(searchLink);

    expect(screen.getByRole("heading", { name: "Search Page" })).toBeInTheDocument();
  });

  it("navigates to Compare Page when 'Compare Page' link is clicked", () => {
    setup("/");

    const compareLink = screen.getByRole("link", { name: "Compare Page" });
    fireEvent.click(compareLink);

    expect(screen.getByRole("heading", { name: "Compare Page" })).toBeInTheDocument();
  });

  it("navigates to Profile Page when 'Profile Page' link is clicked", () => {
    setup("/");

    const profileLink = screen.getByRole("link", { name: "Profile Page" });
    fireEvent.click(profileLink);

    expect(screen.getByRole("heading", { name: "Profile Page" })).toBeInTheDocument();
  });

  it("navigates to Login Page when 'Login Page' link is clicked", () => {
    setup("/");

    const loginLink = screen.getByRole("link", { name: "Login Page" });
    fireEvent.click(loginLink);

    expect(screen.getByRole("heading", { name: "Login Page" })).toBeInTheDocument();
  });

  it("does not navigate when 'About Page' link is clicked (static link)", () => {
    setup("/");

    const aboutLink = screen.getByRole("link", { name: "About Page" });
    fireEvent.click(aboutLink);

    // We should still be on Home Page
    expect(screen.getByRole("heading", { name: "Home Page" })).toBeInTheDocument();
  });
});
