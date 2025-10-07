import { ResponsiveContainer, LineChart, CartesianGrid, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

type Unit = "%" | "$" | "days";
type Metric = "Ratio" | "Revenue" | "Duration";

interface Dataset {
  name: string; // label
  data: { x: number; y: number }[];
  metric: Metric;
  unit: Unit;
}

interface GraphProps {
  datasets: Dataset[]; // up to 4 datasets
  mergedSets: Dataset[];
}

const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];

const LineGraphSmall = ({ datasets, mergedSets }: GraphProps) => {
  return (

    
<div className="flex flex-col items-start w-[75%] h-[400px] bg-gray-100 rounded-lg shadow p-4">
  <div className="w-full h-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={mergedSets}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="x" />
        <YAxis tickFormatter={(v) => `${v}%`} />
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
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>
  )
}

export default LineGraphSmall