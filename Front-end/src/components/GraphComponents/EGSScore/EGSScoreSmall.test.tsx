import { render, screen } from '@testing-library/react';
import EGSScoreSmall from './EGSScoreSmall';

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaLeaf: () => <div data-testid="fa-leaf" />,
  FaUsers: () => <div data-testid="fa-users" />,
  FaUniversity: () => <div data-testid="fa-university" />,
  FaThumbsUp: () => <div data-testid="thumbs-up" />,
  FaThumbsDown: () => <div data-testid="thumbs-down" />,
  FaHandPaper: () => <div data-testid="hand-paper" />,
}));

describe('EGSScoreSmall Component', () => {
  it('renders EGS Score heading', () => {
    render(<EGSScoreSmall environment={80} social={60} governance={40} />);
    expect(screen.getByRole('heading', { name: /ESG Score/i })).toBeInTheDocument();
  });

  it('renders correct score values', () => {
    render(<EGSScoreSmall environment={80} social={60} governance={40} />);
    
    expect(screen.getByTestId('envScore')).toHaveTextContent('80');
    expect(screen.getByTestId('socialScore')).toHaveTextContent('60');
    expect(screen.getByTestId('govScore')).toHaveTextContent('40');
  });

  it('applies correct color classes based on score thresholds', () => {
    render(<EGSScoreSmall environment={80} social={60} governance={40} />);

    expect(screen.getByTestId('envScore')).toHaveClass('text-green-600');  // 80 -> green
    expect(screen.getByTestId('socialScore')).toHaveClass('text-yellow-500'); // 60 -> yellow
    expect(screen.getByTestId('govScore')).toHaveClass('text-red-500'); // 40 -> red
  });

  it('renders correct thumbs icons based on score thresholds', () => {
    render(<EGSScoreSmall environment={80} social={60} governance={40} />);
    
    expect(screen.getByTestId('envThumb').firstChild).toHaveAttribute('data-testid', 'thumbs-up');
    expect(screen.getByTestId('socialThumb').firstChild).toHaveAttribute('data-testid', 'hand-paper');
    expect(screen.getByTestId('govThumb').firstChild).toHaveAttribute('data-testid', 'thumbs-down');
  });

  it('handles boundary values correctly for value', () => {
    render(<EGSScoreSmall environment={75} social={50} governance={49} />);
    
    expect(screen.getByTestId('envScore')).toHaveClass('text-green-600'); // 75 -> green
    expect(screen.getByTestId('socialScore')).toHaveClass('text-yellow-500'); // 50 -> yellow
    expect(screen.getByTestId('govScore')).toHaveClass('text-red-500'); // 49 -> red
  });

   it('handles boundary values correctly for thumbs icon', () => {
    render(<EGSScoreSmall environment={75} social={50} governance={49} />);
    
    expect(screen.getByTestId('envThumb').firstChild).toHaveAttribute('data-testid', 'thumbs-up');
    expect(screen.getByTestId('socialThumb').firstChild).toHaveAttribute('data-testid', 'hand-paper');
    expect(screen.getByTestId('govThumb').firstChild).toHaveAttribute('data-testid', 'thumbs-down');
  });


});
