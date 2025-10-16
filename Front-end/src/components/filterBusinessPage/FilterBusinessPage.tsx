import { useState } from 'react';
import SideBarFilterButton from './sideBar/SideBarFilterButton';
import SidebarFilter from './sideBar/SidebarFilter';
import { GraphButton } from '../GraphButton';

// ------------------------------
// Types
// ------------------------------
type Unit = "%" | "$" | "days" | "Benchmark" | "Times" | "Ratio";
type Metric = "Ratio" | "Revenue" | "Duration" | "ABS Benchmark" | "Forecast";
type Section = "Ratio" | "ABS Benchmarking" | "Statement of Cashflow" | "Forecast";

export interface Dataset {
  name: string;
  data: any[]; // timeseries or benchmark entries
  metric: Metric;
  unit: Unit;
  section: Section;
}

type MetricSection = {
  sectionName: string;
  metrics: string[];
};

// ------------------------------
// Dummy Data
// ------------------------------
const dummyData: Dataset[] = [
  {
    name: "Dividend Ratio",
    data: [{ x: 1, y: 20 }, { x: 2, y: 40 }, { x: 3, y: 60 }],
    metric: "Ratio",
    unit: "%",
    section: "Ratio"
  },
  {
    name: "Other Operating Expenses/Revenue",
    data: [{ x: 1, y: 30 }, { x: 2, y: 50 }, { x: 3, y: 80 }],
    metric: "Ratio",
    unit: "%",
    section: "Ratio"
  },
  {
    name: "Depreciation",
    data: [{ x: 1, y: 200 }, { x: 2, y: 300 }, { x: 3, y: 400 }],
    metric: "Forecast",
    unit: "%",
    section: "Forecast"
  },
    {
    name: "Operation Cycle",
    data: [{ x: 1, y: 300 }, { x: 2, y: 100 }, { x: 3, y: 250 }],
    metric: "Ratio",
    unit: "days",
    section: "Ratio"
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
    metric: "ABS Benchmark",
    unit: "Benchmark",
    section: "ABS Benchmarking"
  },
    {
    name: "Wages and Salaries/Revenue",
    data: [{ x: 1, y: 20 }, { x: 2, y: 50 }, { x: 3, y: 80 }],
    metric: "Ratio",
    unit: "%",
    section: "Ratio"
  }, 
    {
    name: "Other Income/Total Income",
    data: [{ x: 1, y: 30 }, { x: 2, y: 12 }, { x: 3, y: 16 }],
    metric: "Ratio",
    unit: "%",
    section: "Ratio"
  },
    {
    name: "Total Income/Total Expenses",
    data: [{ x: 1, y: 11 }, { x: 2, y: 12 }, { x: 3, y: 8 }],
    metric: "Ratio",
    unit: "%",
    section: "Ratio"
  }, 
  {
    name: "Benchmark B",
    data: [    { name: "Wages and Salaries/Revenue", pass: false, calc_value: 812, abs_value: 12, greater: true},
    { name: "Total Expenses/Total Income", pass: false, calc_value: 102, abs_value: 81, greater: true },
    { name: "Total Expenses/Revenue", pass: true, calc_value: 21.50, abs_value: 986, greater: false}],
    metric: "ABS Benchmark",
    unit: "$",
    section: "ABS Benchmarking"
  },
    {
    name: "Ratio With Dollars",
    data: [{ x: 1, y: 212 }, { x: 2, y: 419 }, { x: 3, y: 387 }],
    metric: "Ratio",
    unit: "$",
    section: "Ratio"
  },
    {
    name: "Descending Dark",
    data: [{ x: 1, y: 220 }, { x: 2, y: 200 }, { x: 3, y: 450 }],
    metric: "Ratio",
    unit: "days",
    section: "Ratio"
  },
      {
    name: "Art Dark",
    data: [{ x: 1, y: 420 }, { x: 2, y: 10 }, { x: 3, y: 312 }],
    metric: "Ratio",
    unit: "days",
    section: "Ratio"
  },
];

// ------------------------------
// Section Generator
// ------------------------------
const mockSections: MetricSection[] = Object.entries(
  dummyData.reduce((acc, curr) => {
    if (!acc[curr.section]) acc[curr.section] = [];
    acc[curr.section].push(curr.name);
    return acc;
  }, {} as Record<string, string[]>)
).map(([sectionName, metrics]) => ({
  sectionName,
  metrics
}));

// ------------------------------
// Component
// ------------------------------
const FilterBusinessPage = () => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectedDataSets, setSelectedDataSets] = useState<Dataset[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSelection = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleGenerate = () => {
    const selected = dummyData.filter((d) =>
      selectedKeys.includes(d.name)
    );
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
          sections={mockSections}
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
