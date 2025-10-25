import { render, screen } from '@testing-library/react';
import EGSScoreLarge from './EGSScoreLarge';

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaLeaf: () => <div data-testid="fa-leaf" />,
  FaUsers: () => <div data-testid="fa-users" />,
  FaUniversity: () => <div data-testid="fa-university" />,
  FaThumbsUp: () => <div data-testid="thumbs-up" />,
  FaThumbsDown: () => <div data-testid="thumbs-down" />,
  FaHandPaper: () => <div data-testid="hand-paper" />,
}));

// Mock recharts components to avoid rendering issues
vi.mock('recharts', () => ({
  RadialBarChart: ({ children }: any) => <div data-testid="radialChart">{children}</div>,
  RadialBar: () => <div />,
  PolarRadiusAxis: () => <div />,
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  Legend: () => <div />,
}));

describe('EGSScoreLarge Component', () => {
  it('renders ESG Score heading', () => {
    render(<EGSScoreLarge environment={80} social={60} governance={40} />);
    expect(screen.getByRole('heading', { name: /ESG Score/i })).toBeInTheDocument();
  });

  it('renders radial graph', () => {
    render(<EGSScoreLarge environment={80} social={60} governance={40} />);
    expect(screen.getByTestId('radialChart')).toBeInTheDocument();
    expect(screen.getByTestId('radialBar')).toBeInTheDocument();
  });

  it('renders correct score values', () => {
    render(<EGSScoreLarge environment={80} social={60} governance={40} />);
    expect(screen.getByTestId('envScoreLarge')).toHaveTextContent('80');
    expect(screen.getByTestId('socialScoreLarge')).toHaveTextContent('60');
    expect(screen.getByTestId('govScoreLarge')).toHaveTextContent('40');
  });

  it('applies correct color classes based on score thresholds', () => {
    render(<EGSScoreLarge environment={80} social={60} governance={40} />);
    expect(screen.getByTestId('envScoreLarge')).toHaveClass('text-green-600');
    expect(screen.getByTestId('socialScoreLarge')).toHaveClass('text-yellow-500');
    expect(screen.getByTestId('govScoreLarge')).toHaveClass('text-red-500');
  });

  it('renders correct thumbs icons based on score thresholds', () => {
    render(<EGSScoreLarge environment={80} social={60} governance={40} />);
    expect(screen.getByTestId('envThumbLarge').firstChild).toHaveAttribute('data-testid', 'thumbs-up');
    expect(screen.getByTestId('socialThumbLarge').firstChild).toHaveAttribute('data-testid', 'hand-paper');
    expect(screen.getByTestId('govThumbLarge').firstChild).toHaveAttribute('data-testid', 'thumbs-down');
  });

  it('handles boundary values correctly for color and icons', () => {
    render(<EGSScoreLarge environment={75} social={50} governance={49} />);
    // Colors
    expect(screen.getByTestId('envScoreLarge')).toHaveClass('text-green-600');
    expect(screen.getByTestId('socialScoreLarge')).toHaveClass('text-yellow-500');
    expect(screen.getByTestId('govScoreLarge')).toHaveClass('text-red-500');
    // Icons
    expect(screen.getByTestId('envThumbLarge').firstChild).toHaveAttribute('data-testid', 'thumbs-up');
    expect(screen.getByTestId('socialThumbLarge').firstChild).toHaveAttribute('data-testid', 'hand-paper');
    expect(screen.getByTestId('govThumbLarge').firstChild).toHaveAttribute('data-testid', 'thumbs-down');
  });
});
