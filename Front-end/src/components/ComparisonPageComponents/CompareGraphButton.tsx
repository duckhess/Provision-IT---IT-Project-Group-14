import DataBox from "../DataBox.tsx";
import type { Metric, } from "../Types/Types.tsx";

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
  selectedKeys: string[]; // names of metrics selected in the sidebar
  companyDatasets: CompanyDataset[]; // array of company datasets
}

export const CompareGraphButton: React.FC<CompareGraphButtonProps> = ({
  selectedKeys,
  companyDatasets,
}) => {

  type LabeledDataset = Dataset & { company: string };

  const allSelectedDatasets: LabeledDataset[] = [];
  companyDatasets.forEach(({ company, datasets }) => {
    selectedKeys.forEach((metricName) => {
      const ds = datasets.find(d => d.name === metricName);
      if (ds) allSelectedDatasets.push({ ...ds, company });
    });
  });
  return (
    <div className="space-y-6">
      {selectedKeys.map((metricName) => (
        <div
          key={metricName}
          className="grid grid-cols-2 gap-4 items-stretch"
        >
          {companyDatasets.map(({ company, datasets }) => {
            // Find the dataset matching this metric
            const ds = datasets.find((d) => d.name === metricName);

            // If not found, create an empty dataset so the graph still renders
            const companyDataset: Dataset = ds
              ? ds
              : {
                  name: metricName,
                  metric: metricName as Metric,
                  unit: "Benchmark" as Unit,
                  data: [],
                };

            return (
              <DataBox
                key={`${company}_${metricName}`}
                datasets={[companyDataset]} // Pass one dataset in an array
                unit={companyDataset.unit}
                metric={companyDataset.metric}// can be metric category if you prefer
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
