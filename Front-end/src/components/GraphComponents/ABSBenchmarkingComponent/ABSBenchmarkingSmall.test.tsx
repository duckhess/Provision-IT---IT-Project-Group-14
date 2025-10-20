/// <reference types="vitest" />
import { render, screen } from '@testing-library/react';
import ABSBenchmarkingSmall, { getScoreColor } from './ABSBenchmarkingSmall';
import { vi } from 'vitest';

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaCheck: () => <div data-testid="fa-check" />,
  FaTimes: () => <div data-testid="fa-times" />,
}));

describe('ABSBenchmarkingSmall', () => {
    it("applies the correct text colour for passRate", ()=>{
        const {rerender} = render(
            <ABSBenchmarkingSmall code="ABC123" passNum={3} failNum={1} passRate={75} />
        );

        // expect: to show green 
        const passRateElement = screen.getByText(/75.00%/);
        expect(passRateElement). toHaveClass(getScoreColor(75));
        
        // expect: show yellow
        rerender(<ABSBenchmarkingSmall code="ABC123" passNum={3} failNum={2} passRate={60}/>);
        const passRateElement2 = screen.getByText(/60.00%/);
        expect(passRateElement2).toHaveClass(getScoreColor(60));
        
        // expect : show red
        rerender(<ABSBenchmarkingSmall code="ABC123" passNum={1} failNum={3} passRate={25}/>);
        const passRateElement3 = screen.getByText(/25.00%/);
        expect(passRateElement3).toHaveClass(getScoreColor(25));
    })
});
