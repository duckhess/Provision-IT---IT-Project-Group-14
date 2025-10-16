import { CompareGraphButton } from "./CompareGraphButton"; // new import
import { useState } from 'react';
import SideBarFilterButton from "../filterBusinessPage/sideBar/SideBarFilterButton";
import SidebarFilter from "../filterBusinessPage/sideBar/SidebarFilter";

type Unit = "%" | "$" | "days" | "Benchmark" | "Times" | "Ratio";
type Metric = "Ratio" | "Revenue" | "Duration" | "ABS Benchmark" | "Forecast";
type Section = "Ratio" | "ABS Benchmarking" | "Statement of Cashflow" | "Forecast";

interface Dataset {
  name: string;
  data: any[];
  metric: Metric;
  unit: Unit;
  section: Section;
}

interface CompanyDataset {
  company: "CompanyA" | "CompanyB";
  datasets: Dataset[];
}

type MetricSection = {
  sectionName: string;
  metrics: string[];
};

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

// Replace dummyData with this structure:
const companyData: CompanyDataset[] = [
  {
    company: "CompanyA",
    datasets: dummyData // use your original dummyData
  },
  {
    company: "CompanyB",
    datasets: dummyData.map((ds) => ({
      ...ds,
      data: ds.data.map((point: any) => ({
        ...point,
        y: point.y * (Math.random() * 0.4 + 0.8) // simulate different company data
      }))
    }))
  }
];

// Build sections from first company
const mockSections: MetricSection[] = Object.entries(
  companyData[0].datasets.reduce((acc, curr) => {
    if (!acc[curr.section]) acc[curr.section] = [];
    acc[curr.section].push(curr.name);
    return acc;
  }, {} as Record<string, string[]>)
).map(([sectionName, metrics]) => ({
  sectionName,
  metrics
}));

const FilterComparisonPage = () => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [finalSelectedKeys, setFinalSelectedKeys] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSelection = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleGenerate = () => {
    setFinalSelectedKeys(selectedKeys);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar toggle button */}
      <SideBarFilterButton onClick={() => setSidebarOpen(!sidebarOpen)} />

      {/* Sidebar */}
      {sidebarOpen && (
        <SidebarFilter
          onClose={handleGenerate}
          sections={mockSections}
          selectedKeys={selectedKeys}
          toggleSelection={handleToggleSelection}

        />
      )}

      {/* Main content area */}
      <div className="flex-1 p-4 overflow-y-auto min-h-0">
        {finalSelectedKeys.length > 0 && (
          <CompareGraphButton
            selectedKeys={finalSelectedKeys}
            companyDatasets={companyData}
          />
        )}
      </div>
      </div>
  );
};

export default FilterComparisonPage;
