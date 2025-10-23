import React from "react";
import DataBox from "../GraphComponents/DataBox.tsx";
import type { Metric, Unit, Dataset, CompanyDataset } from "../Types/Types.tsx";

interface CompareGraphButtonProps {
  selectedKeys: string[]; 
  companyDatasets: CompanyDataset[];
}

export const CompareGraphButton: React.FC<CompareGraphButtonProps> = ({
  selectedKeys,
  companyDatasets,
}) => {
  // Build a mapping from dataset uniqueKey -> Dataset for each company
  const filteredCompanyDatasets = companyDatasets.map(({ company, datasets }) => {
    const selected = datasets.filter(
      (ds) => selectedKeys.includes(`${ds.name}__${ds.metric}`)
    );
    return { company, datasets: selected };
  });

  // Determine all unique keys to display (across companies)
  const allUniqueKeys = Array.from(
    new Set(
      filteredCompanyDatasets.flatMap(({ datasets }) =>
        datasets.map((ds) => `${ds.name}__${ds.metric}`)
      )
    )
  );

  return (
    <div className="space-y-6">
      {allUniqueKeys.map((uniqueKey) => {
        const [name, metric] = uniqueKey.split("__");
        return (
          <div key={uniqueKey} className="grid grid-cols-2 gap-4 items-stretch">
            {filteredCompanyDatasets.map(({ company, datasets }) => {
              // Find the dataset for this uniqueKey
              const ds = datasets.find(
                (d) => `${d.name}__${d.metric}` === uniqueKey
              );

              // If dataset doesn't exist, pass empty placeholder so graph still renders
              const datasetToPass: Dataset = ds
                ? ds
                : {
                    name,
                    metric: metric as Metric,
                    unit: "Benchmark" as Unit,
                    data: [],
                  };
                console.log(ds);
              return (
                <DataBox
                  key={`${company}_${uniqueKey}`}
                  datasets={[datasetToPass]}
                  metric={datasetToPass.metric}
                  unit={datasetToPass.unit}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
