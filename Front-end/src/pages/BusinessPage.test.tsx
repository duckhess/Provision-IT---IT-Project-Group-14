import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import BusinessPage from './BusinessPage';
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

// Mock child component
vi.mock('../components/filterBusinessPage/FilterBusinessPage', () => ({
  default: ({ companyA }: any) => (
    <div data-testid="filterBusinessPage">{companyA.companyName}</div>
  ),
}));

// Mock axios
vi.mock('axios');
const mockedAxios = axios as unknown as { get: any };

describe('BusinessPage Integration Test', () => {
  const dummyCompany = {
    CompanyID: 1,
    CompanyName: 'Test Corp',
    Industry: 'Tech',
    IndustryID: 101,
    ApplicationID: 1001,
    YearEstablished: '2010',
    Location: 'USA',
    UsageOfFunds: 'Growth',
    Amount: '1000000',
    EnvironmentalScore: 90,
    SocialScore: 85,
    ShortGeneralDescription: 'Short desc',
    LongGeneralDescription: 'Long description of company',
    ShortApplicationDescription: 'Short app desc',
    LongApplicationDescription: 'Project starts here • Bullet1 • Bullet2',
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders loading initially', () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [dummyCompany] });

    render(
      <MemoryRouter initialEntries={['/business/1']}>
        <Routes>
          <Route path="/business/:companyId" element={<BusinessPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('fetches API and displays company info correctly', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [dummyCompany] });

    render(
      <MemoryRouter initialEntries={['/business/1']}>
        <Routes>
          <Route path="/business/:companyId" element={<BusinessPage />} />
        </Routes>
      </MemoryRouter>
    );

    const companyHeading = await screen.findByRole('heading', { level: 1 });
    expect(companyHeading).toHaveTextContent('Test Corp');

    expect(screen.getByText(dummyCompany.LongGeneralDescription)).toBeInTheDocument();

    expect(screen.getByText('Project starts here')).toBeInTheDocument();
    expect(screen.getByText('Bullet1')).toBeInTheDocument();
    expect(screen.getByText('Bullet2')).toBeInTheDocument();

    // FilterBusinessPage content (child component)
    const filterComponent = screen.getByTestId('filterBusinessPage');
    expect(filterComponent).toHaveTextContent('Test Corp');
  });

  it('renders placeholder if no company data returned', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter initialEntries={['/business/1']}>
        <Routes>
          <Route path="/business/:companyId" element={<BusinessPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/Loading.../i)).toBeInTheDocument()
    );
  });

  it('renders image if available', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [dummyCompany] });

    render(
      <MemoryRouter initialEntries={['/business/1']}>
        <Routes>
          <Route path="/business/:companyId" element={<BusinessPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByRole('img')).toHaveAttribute('src', '/Pic/1_image.jpg')
    );
  });

  it('clicking Invest button triggers alert', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [dummyCompany] });

    window.alert = vi.fn();

    render(
      <MemoryRouter initialEntries={['/business/1']}>
        <Routes>
          <Route path="/business/:companyId" element={<BusinessPage />} />
        </Routes>
      </MemoryRouter>
    );

    const investButton = await screen.findByRole('button', { name: /Invest/i });
    fireEvent.click(investButton);

    expect(window.alert).toHaveBeenCalledWith('You have clicked the invest button!');
  });
});
