import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchDashboard from './SearchDashboard';
import axios from 'axios';

// Mock child components
vi.mock('./CompanyCard.tsx', () => ({
  default: ({ id, companyName, onClick, isActive }: any) => (
    <div
      data-testid={`companyCard-${id}`}
      onClick={() => onClick(id)}
      className={isActive ? 'active' : ''}
    >
      {companyName}
    </div>
  ),
}));

vi.mock('../Carousel/BasicSummary.tsx', () => ({
  default: ({ company }: any) => (
    <div data-testid="summary">{company?.companyName}</div>
  ),
}));

vi.mock('./SearchPageGrid.tsx', () => ({
  default: ({ company }: any) => (
    <div data-testid="searchPageGrid">{company?.companyName}</div>
  ),
}));

// Mock axios
vi.mock('axios');

describe('SearchDashboard Integration Test', () => {
  const companies = [
    { companyId: 1, companyName: 'ABC Corp' },
    { companyId: 2, companyName: 'XYZ Inc' },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders all company cards', () => {
    render(<SearchDashboard companies={companies} />);

    companies.forEach((c) => {
      expect(screen.getByTestId(`companyCard-${c.companyId}`)).toBeInTheDocument();
      expect(screen.getByText(c.companyName)).toBeInTheDocument();
    });
  });

  it('displays placeholder when no company selected', () => {
    render(<SearchDashboard companies={companies} />);
    expect(
      screen.getByText('Select a startup to see summary and metrics.')
    ).toBeInTheDocument();
  });

  it('clicking on a company card shows summary and search page grid', async () => {
    render(<SearchDashboard companies={companies} />);

    const firstCard = screen.getByTestId('companyCard-1');
    fireEvent.click(firstCard);

    // Highlight should be applied
    expect(firstCard).toHaveClass('active');

    // Child components should appear
    await waitFor(() => {
      expect(screen.getByTestId('summary')).toBeInTheDocument();
      expect(screen.getByTestId('searchPageGrid')).toBeInTheDocument();
    });
  });

  it('switching selection updates highlight and components', async () => {
    render(<SearchDashboard companies={companies} />);

    const firstCard = screen.getByTestId('companyCard-1');
    const secondCard = screen.getByTestId('companyCard-2');

    fireEvent.click(firstCard);
    expect(firstCard).toHaveClass('active');
    expect(secondCard).not.toHaveClass('active');

    fireEvent.click(secondCard);
    expect(secondCard).toHaveClass('active');
    expect(firstCard).not.toHaveClass('active');

    await waitFor(() => {
      expect(screen.getByTestId('summary')).toBeInTheDocument();
      expect(screen.getByTestId('searchPageGrid')).toBeInTheDocument();
    });
  });

  it('handles empty company list', () => {
    render(<SearchDashboard companies={[]} />);
    expect(screen.getByText('No companies to display. Start typing to search.')).toBeInTheDocument();
  });

   it('passes the correct selected company to child components', async () => {
    render(<SearchDashboard companies={companies} />);

    const firstCard = screen.getByTestId('companyCard-1');
    fireEvent.click(firstCard);

    // Wait for child components to render
    await waitFor(() => {
      const summary = screen.getByTestId('summary');
      const grid = screen.getByTestId('searchPageGrid');

      expect(summary).toHaveTextContent('ABC Corp');
      expect(grid).toHaveTextContent('ABC Corp');
    });

    const secondCard = screen.getByTestId('companyCard-2');
    fireEvent.click(secondCard);

    await waitFor(() => {
      const summary = screen.getByTestId('summary');
      const grid = screen.getByTestId('searchPageGrid');

      expect(summary).toHaveTextContent('XYZ Inc');
      expect(grid).toHaveTextContent('XYZ Inc');
    });
  });
});
