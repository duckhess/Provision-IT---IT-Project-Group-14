import { render, screen, fireEvent } from '@testing-library/react';
import EGSScore from './EGSScore';

// Mock react-icons to avoid rendering issues
vi.mock('react-icons/fa', () => ({
  FaLeaf: () => <div data-testid="fa-leaf" />,
  FaUsers: () => <div data-testid="fa-users" />,
  FaUniversity: () => <div data-testid="fa-university" />,
  FaThumbsUp: () => <div data-testid="thumbs-up" />,
  FaThumbsDown: () => <div data-testid="thumbs-down" />,
  FaHandPaper: () => <div data-testid="hand-paper" />,
}));

// Mock ResizeObserver for Recharts ResponsiveContainer
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('EGSScore Integration Test with toggle', () => {
  const props = { social: 80, environment: 60, governance: 40 };

  it('toggles between small and large views and checks radial bar in large view', () => {
    render(<EGSScore {...props} />);

    // Step 1: Small view is visible by default
    const envSmall = screen.getByTestId('envScore');
    const socialSmall = screen.getByTestId('socialScore');
    const govSmall = screen.getByTestId('govScore');

    expect(envSmall).toBeInTheDocument();
    expect(socialSmall).toBeInTheDocument();
    expect(govSmall).toBeInTheDocument();

    expect(screen.queryByTestId('envScoreLarge')).not.toBeInTheDocument();
    expect(screen.queryByTestId('socialScoreLarge')).not.toBeInTheDocument();
    expect(screen.queryByTestId('govScoreLarge')).not.toBeInTheDocument();

    // Step 2: Click to show large view
    fireEvent.click(envSmall); // click small view to expand

    const envLarge = screen.getByTestId('envScoreLarge');
    const socialLarge = screen.getByTestId('socialScoreLarge');
    const govLarge = screen.getByTestId('govScoreLarge');

    expect(envLarge).toBeInTheDocument();
    expect(socialLarge).toBeInTheDocument();
    expect(govLarge).toBeInTheDocument();

    expect(screen.queryByTestId('envScore')).not.toBeInTheDocument();
    expect(screen.queryByTestId('socialScore')).not.toBeInTheDocument();
    expect(screen.queryByTestId('govScore')).not.toBeInTheDocument();

    // Verify radial bar chart exists in large view
    const radialBar = screen.getByTestId('radialBar');
    expect(radialBar).toBeInTheDocument();

    // Step 3: Click again to return to small view
    fireEvent.click(envLarge);

    expect(screen.getByTestId('envScore')).toBeInTheDocument();
    expect(screen.getByTestId('socialScore')).toBeInTheDocument();
    expect(screen.getByTestId('govScore')).toBeInTheDocument();

    expect(screen.queryByTestId('envScoreLarge')).not.toBeInTheDocument();
    expect(screen.queryByTestId('socialScoreLarge')).not.toBeInTheDocument();
    expect(screen.queryByTestId('govScoreLarge')).not.toBeInTheDocument();
  });
});
