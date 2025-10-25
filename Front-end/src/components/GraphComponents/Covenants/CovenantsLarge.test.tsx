import { render, screen } from '@testing-library/react';
import CovenantsLarge from './CovenantsLarge';
import { vi } from 'vitest';

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaCheck: () => <div data-testid="fa-check" />,
  FaTimes: () => <div data-testid="fa-times" />,
}));

describe('CovenantsLarge', () => {
  const mockProps = {
    category: 'Finance',
    pass_list: [
      { name: 'Metric A', pass: true, calc_value: 10, abs_value: 8 },
      { name: 'Metric B', pass: true, calc_value: 15, abs_value: 12 },
    ],
    fail_list: [
      { name: 'Metric C', pass: false, calc_value: 5, abs_value: 10 },
    ],
    spotPercentageRate: 80,
    threeYearAverageSuccess: 55,
  };

  it('renders heading, category, and key percentage values', () => {
    render(<CovenantsLarge {...mockProps} />);

    expect(screen.getByRole('heading', { name: /Covenants/i })).toBeInTheDocument();
    expect(screen.getByText(/Category : Finance/i)).toBeInTheDocument();

    // Spot % Success and 3-Year Average are shown
    expect(screen.getByText(/80.00%/i)).toBeInTheDocument();
    expect(screen.getByText(/55.00%/i)).toBeInTheDocument();
  });

  it('renders correct pass and fail counts in headers', () => {
    render(<CovenantsLarge {...mockProps} />);

    const passHeader = screen.getByTestId('passHeader');
    const failHeader = screen.getByTestId('failHeader');

    expect(passHeader).toHaveTextContent('Pass');
    expect(passHeader).toHaveTextContent('2');
    expect(failHeader).toHaveTextContent('Fail');
    expect(failHeader).toHaveTextContent('1');
    });

  it('renders metric names under the correct Pass and Fail sections', () => {
    render(<CovenantsLarge {...mockProps} />);

    const passSection = screen.getByTestId('passSection');
    const failSection = screen.getByTestId('failSection');

    // Pass section should contain only pass metrics
    expect(passSection).toHaveTextContent('Metric A');
    expect(passSection).toHaveTextContent('Metric B');
    expect(passSection).not.toHaveTextContent('Metric C');

    // Fail section should contain only fail metrics
    expect(failSection).toHaveTextContent('Metric C');
    expect(failSection).not.toHaveTextContent('Metric A');
    expect(failSection).not.toHaveTextContent('Metric B');
    });

  it('renders the mocked icons for pass and fail', () => {
    render(<CovenantsLarge {...mockProps} />);
    expect(screen.getByTestId('fa-check')).toBeInTheDocument();
    expect(screen.getByTestId('fa-times')).toBeInTheDocument();
  });

  it('applies correct color for spot percentage and 3-year average', () => {
    render(<CovenantsLarge {...mockProps} />);

    // 80% : green
    expect(screen.getByText(/80.00%/)).toHaveClass('text-green-600');
    // 55% : yellow
    expect(screen.getByText(/55.00%/)).toHaveClass('text-yellow-500');

    // 30% : red
    render(
      <CovenantsLarge
        {...mockProps}
        spotPercentageRate={30}
        threeYearAverageSuccess={40}
      />
    );
    expect(screen.getByText(/30.00%/)).toHaveClass('text-red-500');
    expect(screen.getByText(/40.00%/)).toHaveClass('text-red-500');
  });

  it('handles boundary color cases correctly', () => {
    render(
      <CovenantsLarge
        {...mockProps}
        spotPercentageRate={75}
        threeYearAverageSuccess={50}
      />
    );

    // 75 : green, 50: yellow
    expect(screen.getByText(/75.00%/)).toHaveClass('text-green-600');
    expect(screen.getByText(/50.00%/)).toHaveClass('text-yellow-500');
  });
});
