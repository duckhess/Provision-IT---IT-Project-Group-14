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

  // Group by company + metric + unit + section
  const grouped = allSelectedDatasets.reduce<Record<string, LabeledDataset[]>>(
    (acc, ds) => {
      const key = `${ds.company}_${ds.metric}_${ds.unit}_${ds.section}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(ds);
      return acc;
    },
    {}
  );

  // Map by metric+unit+section so we can align company graphs per metric
  const groupedByMetricUnitSection = new Map<
    string,
    Record<string, LabeledDataset[]>
  >();

  Object.entries(grouped).forEach(([key, datasets]) => {
    // key = "CompanyA_metric_unit_section"
    const [company, metric, unit, section] = key.split("_");
    const groupKey = `${metric}_${unit}_${section}`; // correct ordering
    if (!groupedByMetricUnitSection.has(groupKey)) {
      groupedByMetricUnitSection.set(groupKey, {});
    }
    groupedByMetricUnitSection.get(groupKey)![company] = datasets;
  });

  return (
    // ensure this wrapper can shrink in flex parents but still provide a height context
    <div className="space-y-6 min-h-0">
      {[...groupedByMetricUnitSection.entries()].map(
        ([groupKey, companyData], i) => {
          // groupKey = "metric_unit_section"
          // Can use metric in the future if needed
          const [_metric, unit, section] = groupKey.split("_"); 

          return (
            <div
              key={`${groupKey}_${i}`}
              className="grid grid-cols-2 gap-4 items-stretch min-h-0"
            >
              {["CompanyA", "CompanyB"].map((company) => {
                const datasets = companyData[company];
                if (!datasets) {
                  // keep cells present so grid layout stays consistent
                  return <div key={company} className="min-h-0" />;
                }

                // Chunk into groups of 4 per DataBox
                const chunks: LabeledDataset[][] = [];
                for (let j = 0; j < datasets.length; j += 4) {
                  chunks.push(datasets.slice(j, j + 4));
                }

                return chunks.map((chunk, idx) => (
                  <div key={`${groupKey}_${company}_${idx}`} className="min-h-0">
                    {/* DataBox should be allowed to fill available grid cell.
                        DataBox itself should manage its own height/overflow */}
                    <DataBox
                      datasets={chunk}
                      unit={unit as Unit}
                      section={section as Section}
                    />
                  </div>
                ));
              })}
            </div>
          );
        }
      )}
    </div>
  );
};