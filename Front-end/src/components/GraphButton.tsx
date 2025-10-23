import DataBox from "./DataBox.tsx";
import type { Metric } from "./Types/Types.tsx";

// type Unit = "%" | "$" | "days" | "Benchmark" | "Times" | "Ratio";


// interface Dataset {
//   name: string; // label
//   data: any[];
//   metric: Metric;
//   unit: Unit;
//   // section: Section;
// }

// interface GraphContainerProps {
//   selectedDatasets: Dataset[];
// }

// export function GraphButton({ selectedDatasets }: GraphContainerProps) {
//   // Group by metric+unit
//   // Record as a (Metric_Unit): Dataset[]
//   const groupedData = selectedDatasets.reduce<Record<string, Dataset[]>>((acc, ds) => {
//     // const key = `${ds.metric}_${ds.unit}_${ds.section}`;
//     const key = `${ds.metric}_${ds.unit}`;

//     // Puts the dataset into the appropriate group with a (Metric_Unit) key.
//     if (!acc[key]) acc[key] = [];
//     acc[key].push(ds);
//     return acc;
//   }, {});

//   return (
//     <div className="grid grid-cols-2 gap-4 items-stretch h-full">

//       {/* Gets an array of key(metric_unit) value(dataset of that metric, unit combination) pairs */}
//       {Object.entries(groupedData).flatMap(([key, datasets]) => {

//         // split into chunks of 4
//         const chunks: Dataset[][] = [];
//         for (let i = 0; i < datasets.length; i += 4) {
//           chunks.push(datasets.slice(i, i + 4));
//         }

//         const unit = datasets[0].unit;
//         const metric = datasets[0].metric;

//         // Create a graph of maximum four dataset in each graph for each key-value pair
//         return chunks.map((chunk, i) => (
//           <DataBox key={`${key}_${i}`} datasets={chunk} unit={unit} metric={metric}/>
//         ));
//       })}
//     </div>
//   );
// }




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
//   selectedKeys: string[];
//   companyDatasets: CompanyDataset[];
// }

// export const GraphButton: React.FC<CompareGraphButtonProps> = ({
//   selectedKeys,
//   companyDatasets,
// }) => {
//   // Filter to only selected datasets for each company
//   const filteredCompanyDatasets = companyDatasets.map(({ company, datasets }) => {
//     const selected = datasets.filter(
//       (ds) =>
//         selectedKeys.includes(ds.name) ||
//         selectedKeys.includes(ds.metric)
//     );
//     return { company, datasets: selected };
//   });

//   // For each company, group datasets by metric+unit combo and split into chunks of 4
//   const groupedByCompany: Record<
//     string, // company
//     Record<string, Dataset[][]> // metricKey -> chunks
//   > = {};

//   filteredCompanyDatasets.forEach(({ company, datasets }) => {
//     const grouped: Record<string, Dataset[]> = {};
//     datasets.forEach(ds => {
//       const key = `${ds.metric}_${ds.unit}`;
//       if (!grouped[key]) grouped[key] = [];
//       grouped[key].push(ds);
//     });

//     const chunked: Record<string, Dataset[][]> = {};
//     Object.entries(grouped).forEach(([key, group]) => {
//       const chunks: Dataset[][] = [];
//       for (let i = 0; i < group.length; i += 4) {
//         chunks.push(group.slice(i, i + 4));
//       }
//       chunked[key] = chunks;
//     });

//     groupedByCompany[company] = chunked;
//   });

//   // Get all metricKeys across companies
//   const allMetricKeys = Array.from(
//     new Set(
//       Object.values(groupedByCompany)
//         .flatMap(g => Object.keys(g))
//     )
//   );

//   console.log("filteredCompanyDatasets, ", filteredCompanyDatasets);

//   return (
//     <div className="grid grid-cols-2 gap-6">
//   {allMetricKeys.map(metricKey => {
//     const numGraphs = Math.max(
//       ...Object.values(groupedByCompany).map(g => g[metricKey]?.length || 0)
//     );

//     return Array.from({ length: numGraphs }).flatMap((_, idx) => {
//       const companyData = filteredCompanyDatasets[0];
//       const companyName = companyData.company;
//       const chunks = groupedByCompany[companyName][metricKey] || [];

//       const datasets = chunks[idx] || [{
//         name: metricKey.split("_")[0],
//         metric: metricKey.split("_")[0] as Metric,
//         unit: metricKey.split("_")[0] as Unit,
//         data: [],
//       }];

//       return (
//         <div key={`${companyName}_${metricKey}_${idx}`} className="w-full h-full">
//           <DataBox
//             datasets={datasets}
//             metric={datasets[0].metric}
//             unit={datasets[0].unit}
//           />
//         </div>
//       );
//     });
//   })}
// </div>

//   );
// };


import React from "react";
// import DataBox from "../DataBox";
// import type { Metric } from "../Types/Types";

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
  selectedKeys: string[]; // now expects ["Revenue__Forecast", "Liabilities__financial_statements", etc.]
  companyDatasets: CompanyDataset[];
}

export const GraphButton: React.FC<CompareGraphButtonProps> = ({
  selectedKeys,
  companyDatasets,
}) => {
  // 1️⃣ Filter datasets to match selected name__metric keys
  const filteredCompanyDatasets = companyDatasets.map(({ company, datasets }) => {
    const selected = datasets.filter((ds) =>
      selectedKeys.includes(`${ds.name}__${ds.metric}`)
    );
    return { company, datasets: selected };
  });

  // 2️⃣ Group by metric+unit combo per company, chunk into 4s for layout
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

  // 3️⃣ Collect all unique metric/unit combinations across companies
  const allMetricKeys = Array.from(
    new Set(
      Object.values(groupedByCompany).flatMap((g) => Object.keys(g))
    )
  );

  // 4️⃣ Render each metric/unit group as grid of DataBoxes
  return (
    <div className="grid grid-cols-2 gap-6">
      {allMetricKeys.map((metricKey) => {
        const numGraphs = Math.max(
          ...Object.values(groupedByCompany).map(
            (g) => g[metricKey]?.length || 0
          )
        );

        return Array.from({ length: numGraphs }).map((_, idx) => {
          return filteredCompanyDatasets.map(({ company, datasets }) => {
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
