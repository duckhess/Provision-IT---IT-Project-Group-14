import DataBox from "./DataBox.tsx";
import type { Dataset, Metric, Unit } from "../Types/Types.tsx";
import React from "react";

interface CompanyDataset {
  company: string;
  datasets: Dataset[];
}

interface CompareGraphButtonProps {
  selectedKeys: string[]; 
  companyDatasets: CompanyDataset[];
}

export const GraphButton: React.FC<CompareGraphButtonProps> = ({
  selectedKeys,
  companyDatasets,
}) => {
  // Filter datasets to match selected name__metric keys
  const filteredCompanyDatasets = companyDatasets.map(({ company, datasets }) => {
    const selected = datasets.filter((ds) =>
      selectedKeys.includes(`${ds.name}__${ds.metric}`)
    );
    return { company, datasets: selected };
  });

  // Group by metric+unit combo per company, chunk into 4s for layout
  const groupedByCompany: Record<
    string, // company name
    Record<string, Dataset[][]> // metricKey -> chunks
  > = {};

  filteredCompanyDatasets.forEach(({ company, datasets }) => {
    const grouped: Record<string, Dataset[]> = {};
    datasets.forEach((ds) => {
      const key = `${ds.metric}_${ds.unit}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(ds);
    });

    const chunked: Record<string, Dataset[][]> = {};
    Object.entries(grouped).forEach(([key, group]) => {
      const chunks: Dataset[][] = [];
      for (let i = 0; i < group.length; i += 4) {
        chunks.push(group.slice(i, i + 4));
      }
      chunked[key] = chunks;
    });

    groupedByCompany[company] = chunked;
  });

  // Collect all unique metric/unit combinations across companies
  const allMetricKeys = Array.from(
    new Set(
      Object.values(groupedByCompany).flatMap((g) => Object.keys(g))
    )
  );

  // Render each metric/unit group as grid of DataBoxes
  return (
    <div className="grid grid-cols-2 gap-6">
      {allMetricKeys.map((metricKey) => {
        const numGraphs = Math.max(
          ...Object.values(groupedByCompany).map(
            (g) => g[metricKey]?.length || 0
          )
        );

        return Array.from({ length: numGraphs }).map((_, idx) => {
          return filteredCompanyDatasets.map(({ company }) => {
            const chunks = groupedByCompany[company][metricKey] || [];
            const datasetsForGraph =
              chunks[idx] ||
              [
                {
                  name: metricKey.split("_")[0],
                  metric: metricKey.split("_")[0] as Metric,
                  unit: metricKey.split("_")[1] as Unit,
                  data: [],
                },
              ];

            return (
              <div
                key={`${company}_${metricKey}_${idx}`}
                className="w-full h-full"
              >
                <DataBox
                  datasets={datasetsForGraph}
                  metric={datasetsForGraph[0].metric}
                  unit={datasetsForGraph[0].unit}
                />
              </div>
            );
          });
        });
      })}
    </div>
  );
};
