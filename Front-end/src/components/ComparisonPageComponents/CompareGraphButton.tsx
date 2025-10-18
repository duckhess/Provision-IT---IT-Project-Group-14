import DataBox from "../DataBox.tsx";
import type { Metric } from "../Types/Types.tsx";

// ---- Type Definitions ---- //

type Unit = "%" | "$" | "days" | "Benchmark" | "Times" | "Ratio";

interface Dataset {
  name: string;
  data: any[];
  metric: Metric;
  unit: Unit;
}

interface CompanyDataset {
  company: "CompanyA" | "CompanyB";
  datasets: Dataset[];
}

interface CompareGraphButtonProps {
  selectedKeys: string[];
  companyDatasets: CompanyDataset[];
}

// ---- Component ---- //

export const CompareGraphButton: React.FC<CompareGraphButtonProps> = ({
  selectedKeys,
  companyDatasets,
}) => {
  // 1️⃣ Flatten datasets and attach company label
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

  // 2️⃣ Group datasets by company + metric + unit
  const grouped = allSelectedDatasets.reduce<Record<string, LabeledDataset[]>>(
    (acc, ds) => {
      const key = `${ds.company}_${ds.metric}_${ds.unit}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(ds);
      return acc;
    },
    {}
  );

  // 3️⃣ Regroup by metric + unit (so each row shows both companies side-by-side)
  const groupedByMetricUnit = new Map<
    string,
    Record<string, LabeledDataset[]>
  >();

  Object.entries(grouped).forEach(([key, datasets]) => {
    const [company, metric, unit] = key.split("_");
    const groupKey = `${metric}_${unit}`;
    if (!groupedByMetricUnit.has(groupKey)) {
      groupedByMetricUnit.set(groupKey, {});
    }
    groupedByMetricUnit.get(groupKey)![company] = datasets;
  });

  // 4️⃣ Render side-by-side DataBoxes per metric/unit
  return (
    <div className="space-y-6">
      {[...groupedByMetricUnit.entries()].map(([groupKey, companyData], i) => {
        const [metric, unit] = groupKey.split("_");

        return (
          <div
            key={`${groupKey}_${i}`}
            className="grid grid-cols-2 gap-4 items-stretch"
          >
            {["CompanyA", "CompanyB"].map((company) => {
              const datasets = companyData[company];
              if (!datasets) return <div key={company}></div>;

              // Split each company's datasets into chunks of 4
              const chunks: LabeledDataset[][] = [];
              for (let j = 0; j < datasets.length; j += 4) {
                chunks.push(datasets.slice(j, j + 4));
              }

              return chunks.map((chunk, idx) => (
                <DataBox
                  key={`${groupKey}_${company}_${idx}`}
                  datasets={chunk}
                  unit={unit as Unit}
                  metric={metric as Metric}
                />
              ));
            })}
          </div>
        );
      })}
    </div>
  );
};