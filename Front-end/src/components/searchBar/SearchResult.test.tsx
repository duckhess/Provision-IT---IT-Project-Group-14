import {render, screen, fireEvent} from "@testing-library/react";
import {describe, it, expect, vi } from "vitest";
import { SearchResult} from "./SearchResult";

describe("SearchResult", () => {
    const mockCompany = {companyId: 1, companyName : "University of Melbourne"}
    const mockOnSelect = vi.fn();

    it("renders the company name", () =>{
        render(<SearchResult result={mockCompany} onSelect={mockOnSelect} />)

        expect(screen.getByText("University of Melbourne")).toBeInTheDocument();
    });

    it("calls onSelect when clicked", ()=>{
        render(<SearchResult result={mockCompany} onSelect={mockOnSelect}/>);

        fireEvent.click(screen.getByText("University of Melbourne"));

        expect(mockOnSelect).toHaveBeenCalledTimes(1);
        expect(mockOnSelect).toHaveBeenCalledWith(mockCompany);
    })
})