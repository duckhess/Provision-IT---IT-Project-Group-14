import React from 'react'

type SidebarFilterProps = {
    onClose : () => void;
    metrics : string[];
    selectedMetric : string[];
    setSelectedMetrics: React.Dispatch<React.SetStateAction<string[]>>;
}

const SidebarFilter: React.FC<SidebarFilterProps> = ({onClose, metrics, selectedMetric, setSelectedMetrics}) => {

  const toggleMetric = (metric:string) => {
    if(selectedMetric.includes(metric)) {
      setSelectedMetrics(selectedMetric.filter( m => m !== metric)) ;
    } else {
      setSelectedMetrics([...selectedMetric, metric]);
    }
  }

  return (
    <div className='fixed top-0 left-0 h-full w-64 shadow-lg p-4 bg-white border-gray-300 z-50 overflow-y-scroll'>
      <h3 className='font-black mb-2'>Filter by: </h3>
      {metrics.map((metric) => (
        <label key = {metric} className='flex items-center gap-2 mb-1 cursor-pointer'>
          <input
          type = "checkbox"
          checked = {selectedMetric.includes(metric)}
          onChange = {()=>toggleMetric(metric)}
          className = "accent-blue-500"/>
          {metric}
        </label>
      ))}

    <button
      onClick = {onClose}
      className='absolute top-3 right-3 text-black hover:text-grey-700 bg-blue-300 rounded-lg px-2 py-1'>
        Generate graph
      </button>
    </div>
  )
}

export default SidebarFilter