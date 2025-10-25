import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import CompanyCard from "./CompanyCard";
import axios from "axios";
import { vi } from "vitest";

// Mock axios
vi.mock("axios");
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
};
mockedAxios.get = vi.fn();

describe("CompanyCard", () => {
  const mockOnClick = vi.fn();
  const companyId = 1;
  const companyName = "EcoCorp";

  const backendData = [
    {
      CompanyID: 1,
      CompanyName: "EcoCorp",
      ShortApplicationDescription: "Eco project description",
      YearEstablished: "2010",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders company name and logo", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: backendData });

    render(
      <CompanyCard
        id={companyId}
        companyName={companyName}
        onClick={mockOnClick}
        isActive={false}
      />
    );

    expect(screen.getByText(companyName)).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      `/Pic/${companyId}_logo.png`
    );
  });

  it("fetches and displays API data correctly", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: backendData });

    render(
      <CompanyCard
        id={companyId}
        companyName={companyName}
        onClick={mockOnClick}
        isActive={false}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText(backendData[0].ShortApplicationDescription)
      ).toBeInTheDocument();
      expect(
        screen.getByText(`Est. ${backendData[0].YearEstablished}`)
      ).toBeInTheDocument();
    });
  });

  it("shows fallback data when API returns empty array", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    render(
      <CompanyCard
        id={companyId}
        companyName={companyName}
        onClick={mockOnClick}
        isActive={false}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText("No description available")
      ).toBeInTheDocument();
      expect(screen.getByText("Est. N/A")).toBeInTheDocument();
    });
  });

  it("calls onClick with correct id when card is clicked", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: backendData });

    render(
      <CompanyCard
        id={companyId}
        companyName={companyName}
        onClick={mockOnClick}
        isActive={false}
      />
    );

    const card = screen.getByText(companyName).closest("div");
    fireEvent.click(card!);

    expect(mockOnClick).toHaveBeenCalledWith(companyId);
  });

  it("applies correct styling based on isActive prop", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: backendData });

    const { rerender } = render(
      <CompanyCard
        id={companyId}
        companyName={companyName}
        onClick={mockOnClick}
        isActive={false}
      />
    );

    const card = screen.getByText(companyName).closest("div");
    expect(card).toHaveClass("bg-white");

    // Rerender as active
    rerender(
      <CompanyCard
        id={companyId}
        companyName={companyName}
        onClick={mockOnClick}
        isActive={true}
      />
    );
    expect(screen.getByText(companyName).closest("div")).toHaveClass(
      "bg-blue-100"
    );
  });

  it("handles API errors gracefully", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <CompanyCard
        id={companyId}
        companyName={companyName}
        onClick={mockOnClick}
        isActive={false}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText("No description available")
      ).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });
});
