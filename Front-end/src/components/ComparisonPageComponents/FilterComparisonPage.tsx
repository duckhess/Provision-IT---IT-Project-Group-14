import { useState, useEffect } from "react";
import { GraphButton } from "../GraphComponents/GraphButton.tsx";
import SideBarFilterButton from "../filterBusinessPage/sideBar/SideBarFilterButton";
import SidebarFilter from "../filterBusinessPage/sideBar/SidebarFilter";
import type {  Dataset } from "../Types/Types.tsx";
import { fetchCompanyDatasets } from "../MetricFormatting/MetricFormat.tsx";

interface Company {
  companyId: number;
  companyName: string;
  datasets?: Dataset[];
}

interface CompanyDataset {
  company: string;
  datasets: Dataset[];
}

interface FilterComparisonPageProps {
  companyA: Company | null;
  companyB: Company | null;
}



/* -------------------- COMPONENT -------------------- */

const FilterComparisonPage: React.FC<FilterComparisonPageProps> = ({
  companyA,
  companyB,
}) => {
  const [companyAMetric, setCompanyAMetric] = useState<Company | null>(null);
  const [companyBMetric, setCompanyBMetric] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [finalSelectedKeys, setFinalSelectedKeys] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (companyA?.companyId) {
          const datasetsA = await fetchCompanyDatasets(companyA.companyId);
          setCompanyAMetric({
            ...companyA,
            datasets: [...datasetsA],
          });
        }
        if (companyB?.companyId) {
          const datasetsB = await fetchCompanyDatasets(companyB.companyId);
          setCompanyBMetric({
            ...companyB,
            datasets: [...datasetsB],
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [companyA, companyB]);

  const companyDatasets: CompanyDataset[] = [
    {
      company: companyA?.companyName ?? "Company A",
      datasets: companyAMetric?.datasets ?? [],
    },
    {
      company: companyB?.companyName ?? "Company B",
      datasets: companyBMetric?.datasets ?? [],
    },
  ];

  const allDatasets: (Dataset & { uniqueKey: string })[] = [];
  const seen = new Set<string>();

  companyDatasets.forEach(({ datasets }) => {
    datasets.forEach((ds) => {
      const uniqueKey = `${ds.name}__${ds.metric}`;
      if (!seen.has(uniqueKey)) {
        allDatasets.push({
          ...ds,
          uniqueKey,
        });
        seen.add(uniqueKey);
      }
    });
  });

  const handleToggleSelection = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleGenerate = () => {
    setFinalSelectedKeys(selectedKeys);
    setSidebarOpen(false);
  };

  return (
    <div className="flex">
      <SideBarFilterButton onClick={() => setSidebarOpen(!sidebarOpen)} />
      {sidebarOpen && (
        <SidebarFilter
          onClose={handleGenerate}
          datasets={allDatasets}
          selectedKeys={selectedKeys}
          toggleSelection={handleToggleSelection}
        />
      )}

      <div className="flex-1 p-4">
        {finalSelectedKeys.length > 0 && companyA && companyB && (
          <GraphButton
            selectedKeys={finalSelectedKeys}
            companyDatasets={companyDatasets}
          />
        )}
      </div>
    </div>
  );
};

export default FilterComparisonPage;