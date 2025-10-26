import React from 'react';
import type { Metric, Dataset } from '../../Types/Types';

type SidebarFilterProps = {
  onClose: () => void;
  datasets: Dataset[]; // full dataset list
  selectedKeys: string[];
  toggleSelection: (key: string) => void;
};

const SidebarFilter: React.FC<SidebarFilterProps> = ({
  onClose,
  datasets,
  selectedKeys,
  toggleSelection,
}) => {
  // Group datasets by their metric category
  const grouped = datasets.reduce<Record<Metric, Dataset[]>>((acc, ds) => {
    if (!acc[ds.metric]) acc[ds.metric] = [];
    acc[ds.metric].push(ds);
    return acc;
  }, {} as Record<Metric, Dataset[]>);

  return (
    <div className="fixed top-0 left-0 h-full w-80 shadow-lg p-4 bg-white border-gray-300 z-50 overflow-y-scroll">
      <h3 className="font-black mb-3 text-lg">Select Metrics</h3>

      {Object.entries(grouped).map(([metricCategory, metricDatasets]) => (
        <div key={metricCategory} className="mb-5">
          <h4 className="font-semibold mb-2 border-b border-gray-200 pb-1">
            {metricCategory}
          </h4>

          <div className="flex flex-col gap-2">
            {metricDatasets.map((ds) => {
              const uniqueKey = `${ds.name}__${ds.metric}`;
              return (
                <label
                  key={uniqueKey}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-md px-2 py-1"
                >
                  <input
                    type="checkbox"
                    checked={selectedKeys.includes(uniqueKey)}
                    onChange={() => toggleSelection(uniqueKey)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm">{ds.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      <button
        onClick={onClose}
        className="w-full text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 font-semibold sticky bottom-4"
      >
        Generate Graph
      </button>
    </div>
  );
};

export default SidebarFilter;
