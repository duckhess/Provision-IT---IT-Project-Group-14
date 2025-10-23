import { ResponsiveContainer, BarChart, CartesianGrid, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import type { Dataset } from '../../Types/Types';

interface GraphProps {
  datasets: Dataset[]; 
  mergedSets: Dataset[];
  yLabel: String
  title: String
}

const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];

const BarGraphLarge = ({ datasets, mergedSets, yLabel, title }: GraphProps) => {
  return (

    
<div className="flex flex-col items-start w-[100%] h-[800px] bg-gray-100 rounded-lg shadow p-4">
  <div className ="px-4 w-full">
    <h2 className='text-black text-xl font-bold border-b mb-4 inline-block'>
      {title}
    </h2>
  </div>
  <div className="w-full h-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={mergedSets}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="x" />
        <YAxis tickFormatter={(v) => `${v}${yLabel}`} />
        <Tooltip />
        <Legend />
        {datasets.map((ds, i) => (
          <Bar
            key={i}
            type="monotone"
            dataKey={ds.name}
            fill={colors[i % colors.length]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>
  )
}

export default BarGraphLarge