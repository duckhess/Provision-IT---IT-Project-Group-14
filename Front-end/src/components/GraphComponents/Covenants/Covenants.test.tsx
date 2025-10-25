import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Covenants from './Covenants';

// Mock icons 
vi.mock('react-icons/fa', () => ({
  FaCheck: () => <div data-testid="fa-check" />,
  FaTimes: () => <div data-testid="fa-times" />,
}));

describe('Covenants Component', () => {
  const mockMetrics = [
    { name: 'Metric A', pass: true, calc_value: 10, abs_value: 8 },
    { name: 'Metric B', pass: true, calc_value: 20, abs_value: 15 },
    { name: 'Metric C', pass: false, calc_value: 5, abs_value: 10 },
  ];

  const category = 'Finance';
  const threeYearAverageSuccess = 55;

  it('renders CovenantsSmall by default', () => {
    render(
      <Covenants
        category={category}
        metric_list={mockMetrics}
        threeYearAverageSuccess={threeYearAverageSuccess}
      />
    );

    // Small view content
    expect(screen.getByText(/Covenants/i)).toBeInTheDocument();
    expect(screen.getByText(/Finance/i)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // passNum
    expect(screen.getByText('1')).toBeInTheDocument(); // failNum
    expect(screen.getByText(/66.67%/)).toBeInTheDocument(); // spot percentage
  });

  it('toggles to CovenantsLarge on click', () => {
    render(
      <Covenants
        category={category}
        metric_list={mockMetrics}
        threeYearAverageSuccess={threeYearAverageSuccess}
      />
    );

    const container = screen.getByText(/Covenants/i).parentElement!;
    fireEvent.click(container);

    // Large view content
    const passSection = screen.getByTestId('passSection');
    const failSection = screen.getByTestId('failSection');

    expect(passSection).toHaveTextContent('Metric A');
    expect(passSection).toHaveTextContent('Metric B');
    expect(failSection).toHaveTextContent('Metric C');

    // Spot % and 3-year average
    expect(screen.getByText(/66.67%/)).toBeInTheDocument();
    expect(screen.getByText(/55.00%/)).toBeInTheDocument();

    expect(screen.getByTestId('fa-check')).toBeInTheDocument();
    expect(screen.getByTestId('fa-times')).toBeInTheDocument();
  });

  it('toggles back and forth between small and large views', async () => {
    render(
      <Covenants
        category={category}
        metric_list={mockMetrics}
        threeYearAverageSuccess={threeYearAverageSuccess}
      />
    );

    // Small view initially
    const smallView = screen.getByText(/Covenants/i).parentElement!;
    expect(smallView).toBeInTheDocument();

    // First click = large view
    fireEvent.click(smallView);
    expect(screen.getByTestId('passSection')).toBeInTheDocument();
    expect(screen.queryByText('passNum')).not.toBeInTheDocument();

    // Second click = back to small
    fireEvent.click(screen.getByText(/Covenants/i).parentElement!);
    expect(screen.getByText('2')).toBeInTheDocument(); // passNum again
  });

  it('calculates pass/fail counts and spot percentage correctly', () => {
    render(
      <Covenants
        category={category}
        metric_list={mockMetrics}
        threeYearAverageSuccess={threeYearAverageSuccess}
      />
    );
    // pass and fail number
    const passNum = screen.getByTestId('passNumSmall');
    const failNum = screen.getByTestId('failNumSmall');

    expect(passNum).toHaveTextContent('2');
    expect(failNum).toHaveTextContent('1');

    // Spot percentage 
    expect(screen.getByText(/66.67%/)).toBeInTheDocument();
  });
});
