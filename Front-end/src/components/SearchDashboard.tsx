import React, { useState } from 'react';
import CompanyCard from '../components/CompanyCard';
import Summary from '../components/BasicSummary';
import SearchDashboardGraph from './SearchGraph.tsx';
import type { Metric } from "./Types/Types.tsx";

type Company = {
    id: number,
    title: string,
    category: string,
    description: string,
    funding: string,
    useOfFunds: string,
    imageUrl: string
}
type Unit = "%" | "$" | "days" | "Benchmark";
type Section = "Ratio" | "ABS Benchmarking" | "Statement of Cashflow" | "Forecast";

interface Dataset {
  name: string; // label
  data: any[];
  metric: Metric;
  unit: Unit;
  section: Section;
}

interface DataItem {
  id: number;
  text: string;
  summary: Company;
  datasets: Dataset[];
}

// Fake mock data
const mockData: DataItem[] = [
  {
    id: 1,
    text: 'Startup A',
    summary: {
      id: 1,
      title: 'Startup A',
      category: 'Fintech',
      description: 'Revolutionizing banking...',
      funding: '$2M',
      useOfFunds: 'Product development, marketing',
      imageUrl: "Test_Image/Organic.jpg",
    },
    datasets: [
      {
        name: 'Revenue Growth',
        data: [{ x: 1, y: 2000 }, { x: 2, y: 3000 }],
        metric: 'Revenue',
        unit: '$',
        section: 'Statement of Cashflow',
      },
      {
        name: 'Burn Ratio',
        data: [{ x: 1, y: 0.5 }, { x: 2, y: 0.6 }],
        metric: 'Ratio',
        unit: '%',
        section: 'Ratio',
      },
      // Add more datasets...
    ],
  },
  // Add more items...
    {
    id: 2,
    text: 'Startup B',
    summary: {
      id: 2,
      title: 'Startup B',
      category: 'Food',
      description: 'FoodYummy',
      funding: '$1.8M',
      useOfFunds: 'SecuringFood',
      imageUrl: 'Test_Image/RandomLogo.png',
    },
    datasets: [
      {
        name: 'Revenue Growth',
        data: [{ x: 1, y: 1250 }, { x: 2, y: 2192 }],
        metric: 'Revenue',
        unit: '$',
        section: 'Statement of Cashflow',
      },
      {
        name: 'Burn Ratio',
        data: [{ x: 1, y: 0.2 }, { x: 2, y: 0.4 }],
        metric: 'Ratio',
        unit: '%',
        section: 'Ratio',
      },
      {
    name: "Benchmark A",
    data: [
    { name: "Wages and Salaries/Revenue", pass: true, calc_value: 7.44, abs_value: 14, greater: false},
    { name: "Total Expenses/Total Income", pass: true, calc_value: 83.61, abs_value: 94, greater: false },
    { name: "Total Expenses/Revenue", pass: true, calc_value: 20.50, abs_value: 96, greater: false},
    { name: "Operating Profit Before Tax/Total Income", pass: true, calc_value: 4.02, abs_value: 6, greater: true},
    { name: "Net Profit/Loss (-) Margin", pass: false, calc_value: 4.02, abs_value: 6, greater: false},
    { name: "EBITDA/Net Revenue", pass: false, calc_value: 6.07, abs_value : 7, greater: false},
    { name: "Interest Cover", pass: true, calc_value: 17.20, abs_value: 7.5, greater: false},
    { name: "EBITDA Margin", pass: true, calc_value: 24.77, abs_value: 7, greater: true},
    { name: "Total Other Income/Revenue", pass: true, calc_value: 2.37, abs_value:1, greater: true},
    { name: "Total Other Income/Net Profit/Loss Before Tax", pass: true, calc_value: 58.88, abs_value: 20, greater: true},
    { name: "Depreciation and Amortisation/Net Revenue", pass: true, calc_value: 1.81, abs_value: 1, greater: true},
    { name: "Interest/Revenue", pass: false, calc_value: 0.25, abs_value: 1, greater: false}
  ],
    metric: "ABS Benchmarking",
    unit: "Benchmark",
    section: "ABS Benchmarking"
  },
    {
    name: "Descending Dark",
    data: [{ x: 1, y: 220 }, { x: 2, y: 200 }, { x: 3, y: 450 }],
    metric: "Ratio",
    unit: "days",
    section: "Ratio"
  },

      // Add more datasets...
    ],
  },
];

const SearchDashboard: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedItem = mockData.find(item => item.id === selectedId) || null;

  return (
    <div className="flex h-full p-6 row-2">
      {/* Left panel */}
      <div className="w-1/4 pr-4 border-r">
        {mockData.map(item => (
          <CompanyCard
            key={item.id}
            id={item.id.toString()}
            text={item.text}
            onClick={() => setSelectedId(item.id)}
            isActive={item.id === selectedId}
          />
        ))}
      </div>

      {/* Right panel */}
      <div className="w-3/4 pl-6 grid grid-rows-[30%_70%]">
        {selectedItem ? (
          <>
            <Summary company={selectedItem.summary} />
            <SearchDashboardGraph datasets={selectedItem.datasets} />
          </>
        ) : (
          <p className="text-gray-500 text-center mt-20">Select a startup to see summary and metrics.</p>
        )}
      </div>
    </div>
  );
};

export default SearchDashboard;