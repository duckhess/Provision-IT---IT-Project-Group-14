import { render, screen, waitFor } from '@testing-library/react';
import CovenanatsSummary from './CovenantsSummary';
import axios from 'axios';

// Mock child components to simplify 
vi.mock('./CovenantsSummarySmall', () => ({
  default: ({ datasets }: any) => (
    <div data-testid="smallView">
      {datasets.map((d: any) => (
        <div key={d.name}>{`${d.name}: ${d.averageSuccess}/${d.spotPercentageSuccess}`}</div>
      ))}
    </div>
  ),
}));

vi.mock('./CovenantsSummaryLarge', () => ({
  default: ({ datasets }: any) => (
    <div data-testid="largeView">
      {datasets.map((d: any) => (
        <div key={d.name}>{`${d.name}: ${d.averageSuccess}/${d.spotPercentageSuccess}`}</div>
      ))}
    </div>
  ),
}));


// Mock axios
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CovenanatsSummary Component - API Integration', () => {
  const mockApplicationId = 42;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches data from API and renders small view with mapped data', async () => {
    // Arrange mock API response
    const mockResponse = {
      data: [
        { Category: 'Liquidity', '3 yr Average % Success': 88.8888, 'Spot % Success': 77.7777 },
        { Category: 'Profitability', '3 yr Average % Success': 66.6666, 'Spot % Success': 55.5555 },
        { Category: 'Dividend Payout', '3 yr Average % Success': 99.99, 'Spot % Success': 99.99 }, // should be filtered out
      ],
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);
    
    render(<CovenanatsSummary applicationId={mockApplicationId} />);

    // Assert API call
    await waitFor(() =>
      expect(mockedAxios.get).toHaveBeenCalledWith(`/api/category?applicationid=${mockApplicationId}`)
    );

    // Assert filtered & formatted data appears
    await waitFor(() => {
      expect(screen.getByText(/Liquidity: 88.89\/77.78/)).toBeInTheDocument();
      expect(screen.getByText(/Profitability: 66.67\/55.56/)).toBeInTheDocument();
      expect(screen.queryByText(/Dividend Payout/)).not.toBeInTheDocument();
    });
  });

  it('shows "No data available" when API returns an empty array', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    render(<CovenanatsSummary applicationId={mockApplicationId} />);

    await waitFor(() => {
      expect(screen.getByText(/No data available/i)).toBeInTheDocument();
    });
  });

  it('handles API error gracefully and shows "No data available"', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

    render(<CovenanatsSummary applicationId={mockApplicationId} />);

    await waitFor(() => {
      expect(screen.getByText(/No data available/i)).toBeInTheDocument();
    });
  });
});
