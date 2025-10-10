import React from 'react';
import DataBox from '../components/DataBox';

type Unit = "%" | "$" | "days" | "Benchmark";
type Metric = "Ratio" | "Revenue" | "Duration" | "Forecast" | "ABS Benchmark";
type Section = "Ratio" | "ABS Benchmarking" | "Statement of Cashflow" | "Forecast";

interface Dataset {
  name: string; // label
  data: any[];
  metric: Metric;
  unit: Unit;
  section: Section;
}

interface SearchGraphProps {
  datasets: Dataset[];
}

const SearchDashboardGraph: React.FC<SearchGraphProps> = ({ datasets }) => {
  // Group datasets by (unit + section)
  const grouped = datasets.reduce<Record<string, Dataset[]>>((acc, ds) => {
    const key = `${ds.unit}_${ds.section}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(ds);
    return acc;
  }, {});

  // Get up to 4 unique (unit, section) combinations
  const groups = Object.entries(grouped).slice(0, 4); // max 4 graphs

  return (
    <div className="grid grid-cols-2 gap-4">
      {groups.map(([key, group], index) => {
        const unit = group[0].unit;
        const section = group[0].section;

        return (
          <DataBox
            key={`${key}_${index}`}
            datasets={group}
            unit={unit}
            section={section}
          />
        );
      })}
    </div>
  );
};

export default SearchDashboardGraph;