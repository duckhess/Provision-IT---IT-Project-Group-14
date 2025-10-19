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
        selectedKeys.includes(ds.metric) // allow matching by metric name too
    );
    return { company, datasets: selected };
  });

  // For each company, group datasets by metric+unit combo
  const groupedByCompany = filteredCompanyDatasets.map(({ company, datasets }) => {
    const grouped: Record<string, Dataset[]> = {};

    datasets.forEach((ds) => {
      const key = `${ds.metric}_${ds.unit}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(ds);
    });

    // Split large groups into chunks of up to 4 datasets
    const groupedChunks = Object.entries(grouped).flatMap(([key, group]) => {
      const chunks: Dataset[][] = [];
      for (let i = 0; i < group.length; i += 4) {
        chunks.push(group.slice(i, i + 4));
      }
      return chunks.map((chunk) => ({ key, datasets: chunk }));
    });

    return { company, groupedChunks };
  });

  // Determine all metric+unit keys (so we render A and B side by side)
  const allMetricKeys = Array.from(
    new Set(
      groupedByCompany.flatMap((c) =>
        c.groupedChunks.map((g) => g.key)
      )
    )
  );

  // Render two graphs per metric key (one per company)
  return (
    <div className="space-y-8">
      {allMetricKeys.map((metricKey) => (
        <div
          key={metricKey}
          className="grid grid-cols-2 gap-6 items-stretch"
        >
          {groupedByCompany.map(({ company, groupedChunks }) => {
            const match = groupedChunks.find((g) => g.key === metricKey);

            // if no dataset group exists, create an empty placeholder dataset
            const placeholderDataset = {
              name: metricKey.split("_")[0],
              metric: metricKey.split("_")[0] as Metric,
              unit: metricKey.split("_")[1] as Unit,
              data: [],
            };

            const datasets = match?.datasets?.length
              ? match.datasets
              : [placeholderDataset];

            return (
              <DataBox
                key={`${company}_${metricKey}`}
                datasets={datasets}
                metric={datasets[0].metric}
                unit={datasets[0].unit}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
