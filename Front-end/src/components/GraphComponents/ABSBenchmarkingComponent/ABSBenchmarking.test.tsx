import {render, screen, fireEvent} from '@testing-library/react';
import {describe, it, expect} from "vitest";
import ABSBenchmarking from './ABSBenchmarking';

describe('ABSBenchmarking Component', () => {
  const mockMetrics = [
    { name: 'Metric A', pass: true, calcValue: 10, absValue: 8, greater: true },
    { name: 'Metric B', pass: true, calcValue: 20, absValue: 15, greater: true },
    { name: 'Metric C', pass: false, calcValue: 5, absValue: 10, greater: false },
  ];

  it('renders ABSBenchmarkingSmall by default', () => {
    render(<ABSBenchmarking code="TEST123" metricList={mockMetrics} />);
    expect(screen.getByText(/ABS Benchmarking/i)).toBeInTheDocument();
    expect(screen.getByText(/Pass Rate/i)).toBeInTheDocument();

    const passSection = screen.getByTestId('passSectionSmall');
    expect(passSection).toHaveTextContent('Pass 2');

    const failSection = screen.getByTestId('failSectionSmall');
    expect(failSection).toHaveTextContent('Fail 1');
    });

  it('toggles to ABSBenchmarkingLarge on click', () => {
    render(<ABSBenchmarking code="TEST123" metricList={mockMetrics} />);
    
    const container = screen.getByText(/ABS Benchmarking/i).parentElement!;
    fireEvent.click(container);

    // Expect large component to render
    const passHeader = screen.getByTestId('passHeader');
    expect(passHeader).toHaveTextContent('Pass2');

    const failHeader = screen.getByTestId('failHeader');
    expect(failHeader).toHaveTextContent('Fail1');

    const passSection = screen.getByTestId("passSection");
    const failSection = screen.getByTestId("failSection");

    expect(passSection).toHaveTextContent("Metric A");
    expect(passSection).toHaveTextContent("Metric B");

    expect(failSection).toHaveTextContent("Metric C");
  });

    it('toggles between small and large views', async () => {
    render(<ABSBenchmarking code="TEST123" metricList={mockMetrics} />);
    
    // default : small view
    const smallView = screen.getByTestId('absSmall');
    expect(smallView).toBeInTheDocument();
    expect(screen.queryByTestId('absLarge')).not.toBeInTheDocument();

    // first click : large view
    fireEvent.click(smallView);
    const largeView = await screen.findByTestId('absLarge');
    expect(largeView).toBeInTheDocument();
    expect(screen.queryByTestId('absSmall')).not.toBeInTheDocument();

    // second click: small view
    fireEvent.click(largeView);
    const smallViewAgain = await screen.findByTestId('absSmall');
    expect(smallViewAgain).toBeInTheDocument();
    expect(screen.queryByTestId('absLarge')).not.toBeInTheDocument();
    });

  it('calculates pass/fail metrics correctly', () => {
    render(<ABSBenchmarking code="TEST123" metricList={mockMetrics} />);
    
    const passSection = screen.getByTestId('passSectionSmall');
    expect(passSection).toHaveTextContent('Pass 2');

    const failSection = screen.getByTestId('failSectionSmall');
    expect(failSection).toHaveTextContent('Fail 1');
  });

  it('calculates passRate correctly', () => {
    render(<ABSBenchmarking code="TEST123" metricList={mockMetrics} />);
    
    const passRateText = screen.getByText(/Pass Rate/i).textContent;
    // metric_list has 3 items, 2 passed -> 66.6667%
    expect(passRateText).toMatch(/66\.67%/);
  });
});