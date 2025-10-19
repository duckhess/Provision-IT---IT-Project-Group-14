// import DataBox from "../DataBox.tsx";
// import type { Metric, } from "../Types/Types.tsx";

// type Unit = "%" | "$" | "days" | "Benchmark" | "Times" | "Ratio";

// interface Dataset {
//   name: string;
//   data: any[];
//   metric: Metric;
//   unit: Unit;
// }

// interface CompanyDataset {
//   company: string;
//   datasets: Dataset[];
// }

// interface CompareGraphButtonProps {
//   selectedKeys: string[]; // names of metrics selected in the sidebar
//   companyDatasets: CompanyDataset[]; // array of company datasets
// }

// export const CompareGraphButton: React.FC<CompareGraphButtonProps> = ({
//   selectedKeys,
//   companyDatasets,
// }) => {

//   type LabeledDataset = Dataset & { company: string };

//   const allSelectedDatasets: LabeledDataset[] = [];
//   companyDatasets.forEach(({ company, datasets }) => {
//     selectedKeys.forEach((metricName) => {
//       const ds = datasets.find(d => d.name === metricName);
//       if (ds) allSelectedDatasets.push({ ...ds, company });
//     });
//   });
//   return (
//     <div className="space-y-6">
//       {selectedKeys.map((metricName) => (
//         <div
//           key={metricName}
//           className="grid grid-cols-2 gap-4 items-stretch"
//         >
//           {companyDatasets.map(({ company, datasets }) => {
//             // Find the dataset matching this metric
//             const ds = datasets.find((d) => d.name === metricName);

//             // If not found, create an empty dataset so the graph still renders
//             const companyDataset: Dataset = ds
//               ? ds
//               : {
//                   name: metricName,
//                   metric: metricName as Metric,
//                   unit: "Benchmark" as Unit,
//                   data: [],
//                 };

//             return (
//               <DataBox
//                 key={`${company}_${metricName}`}
//                 datasets={[companyDataset]} // Pass one dataset in an array
//                 unit={companyDataset.unit}
//                 metric={companyDataset.metric}// can be metric category if you prefer
//               />
//             );
//           })}
//         </div>
//       ))}
//     </div>
//   );
// };


import React from "react";
import DataBox from "../DataBox";
import type { Metric } from "../Types/Types.tsx";

type Unit = "%" | "$" | "days" | "Benchmark" | "Times" | "Ratio";

interface Dataset {
  name: string;
  data: any[];
  metric: Metric;
  unit: Unit;
}

interface CompanyDataset {
  company: string;
  datasets: Dataset[];
}

interface CompareGraphButtonProps {
  selectedKeys: string[];
  companyDatasets: CompanyDataset[];
}

export const CompareGraphButton: React.FC<CompareGraphButtonProps> = ({
  selectedKeys,
  companyDatasets,
}) => {
  // Filter to only selected datasets for each company
  const filteredCompanyDatasets = companyDatasets.map(({ company, datasets }) => {
    const selected = datasets.filter(
      (ds) =>
        selectedKeys.includes(ds.name) ||
        selectedKeys.includes(ds.metric)
    );
    return { company, datasets: selected };
  });

  // For each company, group datasets by metric+unit combo and split into chunks of 4
  const groupedByCompany: Record<
    string, // company
    Record<string, Dataset[][]> // metricKey -> chunks
  > = {};

  filteredCompanyDatasets.forEach(({ company, datasets }) => {
    const grouped: Record<string, Dataset[]> = {};
    datasets.forEach(ds => {
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

  // Get all metricKeys across companies
  const allMetricKeys = Array.from(
    new Set(
      Object.values(groupedByCompany)
        .flatMap(g => Object.keys(g))
    )
  );

  return (
    <div className="space-y-8">
      {allMetricKeys.map(metricKey => {
        // Determine how many graphs we need for this metricKey (max chunks across companies)
        const numGraphs = Math.max(
          ...Object.values(groupedByCompany).map(g => g[metricKey]?.length || 0)
        );

        return Array.from({ length: numGraphs }).map((_, idx) => (
          <div key={`${metricKey}_${idx}`} className="grid grid-cols-2 gap-6 items-stretch">
            {filteredCompanyDatasets.map(({ company }) => {
              const chunks = groupedByCompany[company][metricKey] || [];
              const datasets = chunks[idx] || [{
                name: metricKey.split("_")[0],
                metric: metricKey.split("_")[0] as Metric,
                unit: metricKey.split("_")[1] as Unit,
                data: [],
              }];
              return (
                <DataBox
                  key={`${company}_${metricKey}_${idx}`}
                  datasets={datasets}
                  metric={datasets[0].metric}
                  unit={datasets[0].unit}
                />
              );
            })}
          </div>
        ));
      })}
    </div>
  );
};
