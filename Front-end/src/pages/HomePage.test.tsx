import { render, screen, fireEvent } from '@testing-library/react';
import HomePage from './HomePage';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';

// Mock child components
vi.mock('../components/Carousel/BasicSummary', () => ({
  default: ({ company }: any) => <div data-testid="summary">{company.companyName}</div>,
}));

vi.mock('../components/searchBar/SearchBarComponent', () => ({
  default: ({ handleSearchClick }: any) => (
    <button data-testid="searchButton" onClick={() => handleSearchClick('Test Company')}>
      Search
    </button>
  ),
}));

// Mock axios
vi.mock('axios');

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('HomePage Integration Test', () => {
  const companies = [
    { companyId: 1, companyName: 'ABC Corp' },
    { companyId: 2, companyName: 'XYZ Inc' },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers();
    (axios.get as any).mockResolvedValue({ data: companies });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders static sections correctly', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // Welcome section
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
    expect(screen.getByTestId('searchButton')).toBeInTheDocument();

    // Hero section
    expect(screen.getByText(/The future of decentralised investing is here/i)).toBeInTheDocument();
    expect(screen.getByText(/We present a unique way for investors/i)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'homePage.jpg');

    // Investment highlight section
    expect(screen.getByText(/See where people are investing today/i)).toBeInTheDocument();
    expect(screen.getByText(/Curious about what's hot right now/i)).toBeInTheDocument();
  });

  it('search button triggers navigation', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const button = screen.getByTestId('searchButton');
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/search?query=Test%20Company');
  });

});
