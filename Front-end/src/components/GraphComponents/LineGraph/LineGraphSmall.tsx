import { ResponsiveContainer, LineChart, CartesianGrid, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import type { Dataset } from "../../Types/Types";

interface GraphProps {
  datasets: Dataset[]; 
  mergedSets: Array<{ [key: string]: number | string }>;
  yLabel: String;
  title: String;
}

const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];

const LineGraphSmall = ({ datasets, mergedSets, yLabel, title }: GraphProps) => {
  return (

    
<div className="flex flex-col items-start w-[75%] h-[400px] bg-gray-100 rounded-lg shadow p-4">
    <div className ="px-4 w-full">
      <h2 className='text-black text-xl font-bold border-b mb-4 inline-block'>
        {title}
      </h2>
    </div>
  <div className="w-full h-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={mergedSets}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="x" />
        <YAxis tickFormatter={(v) => `${v}${yLabel}`} />
        <Tooltip />
        <Legend />
        {datasets.map((ds, i) => (
          <Line
            key={i}
            type="monotone"
            dataKey={ds.name}
            stroke={colors[i % colors.length]}
            strokeWidth={i + 1}
            strokeDasharray="5 5"
            data-testid={`line-${ds.name.replace(/\s+/g, "-")}`}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>
  )
}

export default LineGraphSmall