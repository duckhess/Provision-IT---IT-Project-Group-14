/// <reference types="vitest" />
import { render, screen } from '@testing-library/react';
import ABSBenchmarkingLarge from './ABSBenchmarkingLarge';
import { vi } from 'vitest';

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaCheck: () => <div data-testid="fa-check" />,
  FaTimes: () => <div data-testid="fa-times" />,
}));

describe("ABSBenchmarkingLarge", ()=>{
const mockProps = {
    code: 'TEST123',
    passRate: 80,
    pass_list: [
      { name: 'Metric A', pass: true, calc_value: 10, abs_value: 8, greater: true },
      { name: 'Metric B', pass: true, calc_value: 20, abs_value: 15, greater: true },
    ],
    fail_list: [
      { name: 'Metric C', pass: false, calc_value: 5, abs_value: 10, greater: false },
    ],
  };

  it("renders code and pass rate", ()=>{
    render(<ABSBenchmarkingLarge {...mockProps}/>);
    expect(screen.getByText(/Code : TEST123/i)).toBeInTheDocument();
    expect(screen.getByText(/80.00%/i)).toBeInTheDocument();
  });

  it('renders correct pass and fail counts', () => {
    render(<ABSBenchmarkingLarge {...mockProps}/>);
    const passHeader = screen.getByTestId('passHeader');
    expect(passHeader).toHaveTextContent('Pass2');

    const failHeader = screen.getByTestId('failHeader');
    expect(failHeader).toHaveTextContent('Fail1');
  });

  it('renders metric name under the corresponding sections', ()=>{
    render(<ABSBenchmarkingLarge {...mockProps}/>);

    const passSection = screen.getByTestId("passSection");
    const failSection = screen.getByTestId("failSection");

    expect(passSection).toHaveTextContent("Metric A");
    expect(passSection).toHaveTextContent("Metric B");

    expect(failSection).toHaveTextContent("Metric C");
  })
});