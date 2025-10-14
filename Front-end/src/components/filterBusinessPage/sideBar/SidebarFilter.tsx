import React from 'react';

type MetricSection = {
  sectionName: string;
  metrics?: string[];
};

type SidebarFilterProps = {
  onClose: () => void;
  sections: MetricSection[];
  selectedKeys: string[];
  toggleSelection: (key: string) => void;
};

const SidebarFilter: React.FC<SidebarFilterProps> = ({
  onClose,
  sections,
  selectedKeys,
  toggleSelection,
}) => {
  return (
    <div className="fixed top-0 left-0 h-full w-80 shadow-lg p-4 bg-white border-gray-300 z-50 text-start overflow-y-scroll">
      <h3 className="font-black mb-2">Filter by:</h3>

      {sections.map((section) => (
        <div key={section.sectionName} className="mb-4">
          <h4 className="font-semibold mb-1">{section.sectionName}</h4>

          {section.metrics?.map((metric) => {
            return (
              <label
                key={metric}
                className="flex items-center gap-2 mb-1 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedKeys.includes(metric)}
                  onChange={() => toggleSelection(metric)}
                  className="accent-blue-500"
                />
                {metric}
              </label>
            );
          })}
        </div>
      ))}

      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2"
      >
        Generate Graph
      </button>
    </div>
  );
};

export default SidebarFilter;
