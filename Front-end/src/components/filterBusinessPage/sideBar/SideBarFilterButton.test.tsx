import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import SideBarFilterButton from './SideBarFilterButton';

describe('SideBarFilterButton Component', () => {
  it('renders the button with the correct text and icon', () => {
    const mockClick = vi.fn();
    render(<SideBarFilterButton onClick={mockClick} />);

    const button = screen.getByRole('button', { name: /Selection/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText(/Selection/i)).toBeInTheDocument();
  });

  it('calls onClick when the button is clicked', () => {
    const mockClick = vi.fn();
    render(<SideBarFilterButton onClick={mockClick} />);

    const button = screen.getByRole('button', { name: /Selection/i });
    fireEvent.click(button);

    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});
