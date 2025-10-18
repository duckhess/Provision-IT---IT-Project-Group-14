import { useState } from 'react';
import SideBarFilterButton from './sideBar/SideBarFilterButton';
import SidebarFilter from './sideBar/SidebarFilter';
import { GraphButton } from '../GraphButton';
import type { Metric } from '../Types/Types';

// ------------------------------
// Types
// ------------------------------
type Unit = "%" | "$" | "days" | "Benchmark" | "Times" | "Ratio";

export interface Dataset {
  name: string;
  data: any[]; // timeseries or benchmark entries
  metric: Metric;
  unit: Unit;
}

// type MetricSection = {
//   sectionName: string;
//   metrics: string[];
// };

// ------------------------------
// Dummy Data
// ------------------------------

const dummyData: Dataset[] = [
  // --- Liquidity Ratios ---
  {
    name: "Current Ratio",
    data: [
      { x: 2023, y: 3.28 },
      { x: 2024, y: 3.12 },
      { x: 2025, y: 1.93 },
    ],
    metric: "Ratio",
    unit: "Times",
  },
  {
    name: "Quick Ratio (Acid Test)",
    data: [
      { x: 2023, y: 1.87 },
      { x: 2024, y: 1.39 },
      { x: 2025, y: 0.96 },
    ],
    metric: "Ratio",
    unit: "Times",
  },

  // --- Solvency Ratios ---
  {
    name: "Debt Ratio",
    data: [
      { x: 2023, y: 39 },
      { x: 2024, y: 50 },
      { x: 2025, y: 48 },
    ],
    metric: "Ratio",
    unit: "%",
  },
  {
    name: "Equity Ratio",
    data: [
      { x: 2023, y: 61 },
      { x: 2024, y: 50 },
      { x: 2025, y: 52 },
    ],
    metric: "Ratio",
    unit: "%",
  },
  {
    name: "Capitalisation Ratio",
    data: [
      { x: 2023, y: 165 },
      { x: 2024, y: 199 },
      { x: 2025, y: 191 },
    ],
    metric: "Ratio",
    unit: "%",
  },

  // --- Profitability Ratios ---
  {
    name: "Gross Profit Margin",
    data: [
      { x: 2023, y: 22 },
      { x: 2024, y: 19 },
      { x: 2025, y: 22 },
    ],
    metric: "Ratio",
    unit: "%",
  },
  {
    name: "Net Profit/Loss (-) Margin",
    data: [
      { x: 2023, y: 5 },
      { x: 2024, y: 2 },
      { x: 2025, y: 4 },
    ],
    metric: "Ratio",
    unit: "%",
  },
  {
    name: "Return on Total Assets",
    data: [
      { x: 2023, y: 16 },
      { x: 2024, y: 7 },
      { x: 2025, y: 8 },
    ],
    metric: "Ratio",
    unit: "%",
  },
  {
    name: "Interest Cover",
    data: [
      { x: 2023, y: 47.02 },
      { x: 2024, y: 4192.66 },
      { x: 2025, y: 17.2 },
    ],
    metric: "Ratio",
    unit: "Times",
  },

  // --- Efficiency Ratios ---
  {
    name: "Receivables Turnover",
    data: [
      { x: 2023, y: 7.57 },
      { x: 2024, y: 11.59 },
      { x: 2025, y: 8.79 },
    ],
    metric: "Ratio",
    unit: "Times",
  },
  {
    name: "Inventory Turnover (days)",
    data: [
      { x: 2023, y: 37 },
      { x: 2024, y: 45 },
      { x: 2025, y: 41 },
    ],
    metric: "Ratio",
    unit: "days",
  },
  {
    name: "Operating Cycle (days)",
    data: [
      { x: 2023, y: 75 },
      { x: 2024, y: 60 },
      { x: 2025, y: 54 },
    ],
    metric: "Ratio",
    unit: "days",
  },

  // --- ABS Benchmarking ---
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
  },

  // --- Statement of Cashflows ---
  {
    name: "Revenue",
    data: [
      { x: 2024, y: 13736093 },
      { x: 2025, y: 15699648 },
    ],
    metric: "Statement of Cashflow",
    unit: "$",
  },
  {
    name: "Cost of Sales",
    data: [
      { x: 2024, y: 11123405 },
      { x: 2025, y: 12222437 },
    ],
    metric: "Statement of Cashflow",
    unit: "$",
  },
  {
    name: "Profit/Loss for Period",
    data: [
      { x: 2024, y: 326782 },
      { x: 2025, y: 630973 },
    ],
    metric: "Statement of Cashflow",
    unit: "$",
  },
  {
    name: "Depreciation",
    data: [
      { x: 2024, y: 172402 },
      { x: 2025, y: 283548 },
    ],
    metric: "Statement of Cashflow",
    unit: "$",
  },

  // --- Forecast ---
  {
    name: "Forecast Revenue",
    data: [
      { x: 2023, y: 15766553 },
      { x: 2024, y: 13736093 },
      { x: 2025, y: 15699605 },
    ],
    metric: "Forecast",
    unit: "$",
  },
  {
    name: "% Total Other Income / Revenue",
    data: [
      { x: 2023, y: 1.48 },
      { x: 2024, y: 2.33 },
      { x: 2025, y: 2.37 },
    ],
    metric: "Forecast",
    unit: "%",
  },
];

// ------------------------------
// Section Generator
// ------------------------------
// const mockSections: MetricSection[] = Object.entries(
//   dummyData.reduce((acc, curr) => {
//     if (!acc[curr.section]) acc[curr.section] = [];
//     acc[curr.section].push(curr.name);
//     return acc;
//   }, {} as Record<string, string[]>)
// ).map(([sectionName, metrics]) => ({
//   sectionName,
//   metrics
// }));

// ------------------------------
// Component
// ------------------------------
// ------------------------------
// Component
// ------------------------------
const FilterBusinessPage = () => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectedDataSets, setSelectedDataSets] = useState<Dataset[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSelection = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    );
  };

  const handleGenerate = () => {
    const selected = dummyData.filter((d) => selectedKeys.includes(d.name));
    setSelectedDataSets(selected);
    setSidebarOpen(false);
  };

  return (
    <div className="grid grid-rows-[35px]">
      <div>
        <SideBarFilterButton onClick={() => setSidebarOpen(!sidebarOpen)} />

      {sidebarOpen && (
        <SidebarFilter
          onClose={handleGenerate}
          datasets={dummyData} // simplified: just pass all dataset names
          selectedKeys={selectedKeys}
          toggleSelection={handleToggleSelection}
        />
      )}
      </div>
      <div className="flex-1 p-4">
        <GraphButton selectedDatasets={selectedDataSets} />
      </div>
    </div>
  );
};

export default FilterBusinessPage;
