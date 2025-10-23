import { useState, useEffect } from 'react';
import SideBarFilterButton from './sideBar/SideBarFilterButton';
import SidebarFilter from './sideBar/SidebarFilter';
import { GraphButton } from '../GraphComponents/GraphButton';
import type { Dataset } from '../Types/Types';
import type { Company, CompanyDataset } from '../MetricFormatting/MetricFormat';
import { fetchCompanyDatasets } from '../MetricFormatting/MetricFormat';

interface FilterBusinessPageProps {
  companyA: Company | null;
}

/* -------------------- MAIN COMPONENT -------------------- */

const FilterBusinessPage: React.FC<FilterBusinessPageProps> = ({ companyA }) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [companyMetric, setCompanyMetric] = useState<Company | null>(null);
  const [finalSelectedKeys, setFinalSelectedKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (companyA?.companyId) {
          const dataSetsA = await fetchCompanyDatasets(companyA.companyId);
          setCompanyMetric({ ...companyA, datasets: dataSetsA });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [companyA]);

  const companyDatasets: CompanyDataset[] = [
    {
      company: companyMetric?.companyName ?? "Company A",
      datasets: companyMetric?.datasets ?? [],
    },
  ];

  // --- 🔹 Build allDatasets list for SidebarFilter (unique name__metric keys)
  const allDatasets: (Dataset & { uniqueKey: string })[] = [];
  const seen = new Set<string>();

  companyDatasets.forEach(({ datasets }) => {
    datasets.forEach((ds) => {
      const uniqueKey = `${ds.name}__${ds.metric}`;
      if (!seen.has(uniqueKey)) {
        allDatasets.push({ ...ds, uniqueKey });
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
    <div className="grid grid-rows-[35px]">
      <div>
        <SideBarFilterButton onClick={() => setSidebarOpen(!sidebarOpen)} />

        {sidebarOpen && (
          <SidebarFilter
            onClose={handleGenerate}
            datasets={allDatasets}
            selectedKeys={selectedKeys}
            toggleSelection={handleToggleSelection}
          />
        )}
      </div>

      <div className="flex-1 p-4">
        {finalSelectedKeys.length > 0 && companyA && (
          <GraphButton
            selectedKeys={finalSelectedKeys}
            companyDatasets={companyDatasets}
          />
        )}
      </div>
    </div>
  );
};

export default FilterBusinessPage;
