import DataBox from "../DataBox.tsx";

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

interface CompareGraphButtonProps {
  selectedKeys: string[];
  companyDatasets: CompanyDataset[];
}

export const CompareGraphButton: React.FC<CompareGraphButtonProps> = ({
  selectedKeys,
  companyDatasets
}) => {
  // 1. Flatten datasets with company info
  type LabeledDataset = Dataset & { company: string };

  const allSelectedDatasets: LabeledDataset[] = [];

  companyDatasets.forEach(({ company, datasets }) => {
    selectedKeys.forEach((metricName) => {
      const found = datasets.find((ds) => ds.name === metricName);
      if (found) {
        allSelectedDatasets.push({ ...found, company });
      }
    });
  });

  // 2. Group by company + metric + unit + section
  const grouped = allSelectedDatasets.reduce<
    Record<string, LabeledDataset[]>
  >((acc, ds) => {
    const key = `${ds.company}_${ds.metric}_${ds.unit}_${ds.section}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(ds);
    return acc;
  }, {});

  // 3. Organize into rows of 2 (Company A and B side-by-side)
  // Map by metric+unit+section so we can align company graphs per metric
  const groupedByMetricUnitSection = new Map<
    string,
    Record<string, LabeledDataset[]>
  >();

  Object.entries(grouped).forEach(([key, datasets]) => {
    const [company, metric, unit, section] = key.split("_");
    const groupKey = `${metric}_${unit}_${section}`;
    if (!groupedByMetricUnitSection.has(groupKey)) {
      groupedByMetricUnitSection.set(groupKey, {});
    }
    groupedByMetricUnitSection.get(groupKey)![company] = datasets;
  });

  return (
    <div className="space-y-6">
      {[...groupedByMetricUnitSection.entries()].map(
        ([groupKey, companyData], i) => {
          const [unit, section] = groupKey.split("_");

          return (
            <div
              key={`${groupKey}_${i}`}
              className="grid grid-cols-2 gap-4 items-stretch"
            >
              {["CompanyA", "CompanyB"].map((company) => {
                const datasets = companyData[company];
                if (!datasets) return <div key={company}></div>;

                // Chunk into groups of 4 per graph
                const chunks: LabeledDataset[][] = [];
                for (let i = 0; i < datasets.length; i += 4) {
                  chunks.push(datasets.slice(i, i + 4));
                }

                return chunks.map((chunk, idx) => (
                  <DataBox
                    key={`${groupKey}_${company}_${idx}`}
                    datasets={chunk}
                    unit={unit as Unit}
                    section={section as Section}
                  />
                ));
              })}
            </div>
          );
        }
      )}
    </div>
  );
};
