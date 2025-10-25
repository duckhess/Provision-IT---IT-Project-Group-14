import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchPage from './SearchPage';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';

// Mock child components
vi.mock('../components/searchBar/SearchBarComponent', () => ({
  default: ({ setSearchResults, allCompanies, handleSearchClick }: any) => (
    <button
      data-testid="searchButton"
      onClick={() => setSearchResults([allCompanies[0]])}
    >
      Search
    </button>
  ),
}));

vi.mock('../components/SearchPageComponents/filterSearchPage/FilterSearchPage', () => ({
  default: ({ setSearchResults }: any) => (
    <button
      data-testid="filterButton"
      onClick={() => setSearchResults([])}
    >
      Filter
    </button>
  ),
}));

vi.mock('../components/SearchPageComponents/SearchDashboard', () => ({
  default: ({ companies }: any) => (
    <div data-testid="dashboard">
      {companies.map((c: any) => (
        <div key={c.companyId} data-testid={`company-${c.companyId}`}>
          {c.companyName}
        </div>
      ))}
    </div>
  ),
}));

// Mock axios
vi.mock('axios');

describe('SearchPage Integration Test', () => {
  const companies = [
    { companyId: 1, companyName: 'ABC Corp' },
    { companyId: 2, companyName: 'XYZ Inc' },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    (axios.get as any).mockResolvedValue({ data: companies });
  });

  it('fetches companies and renders dashboard', async () => {
    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    // Loading indicator
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    // Wait for API fetch
    await waitFor(() => expect(screen.getByTestId('dashboard')).toBeInTheDocument());

    // All companies rendered in dashboard
    expect(screen.getByTestId('company-1')).toHaveTextContent('ABC Corp');
    expect(screen.getByTestId('company-2')).toHaveTextContent('XYZ Inc');
  });

  it('updates dashboard when search is performed', async () => {
    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByTestId('dashboard')).toBeInTheDocument());

    const searchButton = screen.getByTestId('searchButton');
    fireEvent.click(searchButton);

    // Dashboard should now only show the first company
    expect(screen.getByTestId('company-1')).toBeInTheDocument();
    expect(screen.queryByTestId('company-2')).not.toBeInTheDocument();
  });

  it('updates dashboard when filter is applied', async () => {
    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByTestId('dashboard')).toBeInTheDocument());

    const filterButton = screen.getByTestId('filterButton');
    fireEvent.click(filterButton);

    // Dashboard should now be empty
    expect(screen.queryByTestId('company-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('company-2')).not.toBeInTheDocument();
  });

  it('handles empty API response gracefully', async () => {
    (axios.get as any).mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    // Dashboard should exist but have no companies
    await waitFor(() => expect(screen.getByTestId('dashboard')).toBeInTheDocument());
    expect(screen.queryByTestId('company-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('company-2')).not.toBeInTheDocument();
  });
});
