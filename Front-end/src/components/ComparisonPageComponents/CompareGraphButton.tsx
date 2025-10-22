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
  // unique keys like "Revenue__Forecast"
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
