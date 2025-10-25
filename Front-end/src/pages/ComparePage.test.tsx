import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ComparePage from './ComparePage';
import axios from 'axios';
import { vi } from 'vitest';

// Mock child components
vi.mock('../components/searchBar/SearchBarComponent', () => ({
  default: ({ setSearchResults, 'data-testid': testId }: any) => (
    <button
      data-testid="searchButton"
      onClick={() => setSearchResults([{ companyId: 1, companyName: 'ABC Corp' }])}
    >
      Select Company
    </button>
  ),
}));

vi.mock('../components/ComparisonPageComponents/FilterComparisonPage', () => ({
  default: ({ companyA, companyB }: any) => (
    <div data-testid="filterComparisonPage">
      {companyA?.companyName}-{companyB?.companyName}
    </div>
  ),
}));

vi.mock('axios');
const mockedAxios = axios as unknown as { get: any };

describe('ComparePage Integration Test', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('fetches companies and updates search bars', async () => {
    mockedAxios.get.mockResolvedValue({ data: [
      { companyId: 1, companyName: 'ABC Corp' },
      { companyId: 2, companyName: 'XYZ Inc' }
    ]});

    render(<ComparePage />);

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledWith('/api/companies'));
  });

  it('selects same company for both sides and updates FilterComparisonPage', async () => {
    mockedAxios.get.mockResolvedValue({
      data: [
        { companyId: 1, companyName: 'ABC Corp' },
        { companyId: 2, companyName: 'XYZ Inc' }
      ]
    });

    render(<ComparePage />);

    const searchButtons = screen.getAllByTestId('searchButton');

    // Select companyA
    fireEvent.click(searchButtons[0]);
    await waitFor(() =>
      expect(screen.getByTestId('companyAName')).toHaveTextContent('ABC Corp')
    );

    // Select companyB 
    fireEvent.click(searchButtons[1]);
    await waitFor(() =>
      expect(screen.getByTestId('companyBName')).toHaveTextContent('ABC Corp')
    );

    // Check FilterComparisonPage
    expect(screen.getByTestId('filterComparisonPage')).toHaveTextContent('ABC Corp-ABC Corp');
  });

  it('handles empty company list gracefully', async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    render(<ComparePage />);

    await waitFor(() => {
      expect(screen.queryAllByTestId('searchButton')).toHaveLength(2);
    });
  });
});
