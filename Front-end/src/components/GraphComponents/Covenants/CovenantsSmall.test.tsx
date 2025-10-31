import { render, screen } from '@testing-library/react';
import CovenantsSmall from './CovenantsSmall';
import { vi } from 'vitest';

// Mock icons (keeps output clean)
vi.mock('react-icons/fa', () => ({
  FaCheck: () => <div data-testid="fa-check" />,
  FaTimes: () => <div data-testid="fa-times" />,
}));

describe('CovenantsSmall', () => {
  it('shows the main heading and displays category + spot rate', () => {
    render(<CovenantsSmall category="Finance" passNum={4} failNum={1} spotPercentageRate={80} />);

    // Heading should be visible
    expect(screen.getByRole('heading', { name: /covenants/i })).toBeInTheDocument();

    // Should show category and spot percentage
    expect(screen.getByText(/Finance/i)).toBeInTheDocument();
    expect(screen.getByText(/80.00%/)).toBeInTheDocument();
  });

  it('applies the correct color class depending on spotPercentageRate', () => {
    const { rerender } = render(<CovenantsSmall category="Tech" passNum={3} failNum={1} spotPercentageRate={75} />);
    const rate = screen.getByText(/75.00%/);
    expect(rate).toHaveClass('text-green-600');

    rerender(<CovenantsSmall category="Tech" passNum={3} failNum={1} spotPercentageRate={55} />);
    expect(screen.getByText(/55.00%/)).toHaveClass('text-yellow-500');

    rerender(<CovenantsSmall category="Tech" passNum={3} failNum={1} spotPercentageRate={30} />);
    expect(screen.getByText(/30.00%/)).toHaveClass('text-red-500');
  });

  it('handles boundary values correctly (70 = green, 50 = yellow)', () => {
    const { rerender } = render(<CovenantsSmall category="Boundary" passNum={0} failNum={0} spotPercentageRate={75} />);
    expect(screen.getByText(/75.00%/)).toHaveClass('text-green-600');

    rerender(<CovenantsSmall category="Boundary" passNum={0} failNum={0} spotPercentageRate={50} />);
    expect(screen.getByText(/50.00%/)).toHaveClass('text-yellow-500');
  });
});
