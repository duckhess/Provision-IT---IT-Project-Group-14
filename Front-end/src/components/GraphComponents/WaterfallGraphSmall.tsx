import { ResponsiveContainer, BarChart, CartesianGrid, Bar, XAxis, YAxis, Tooltip, Legend, Cell } from "recharts";

type Unit = "%" | "$" | "days";
type Metric = "Ratio" | "Revenue" | "Duration";

interface Dataset {
  name: string;
  data: { x: number; y: number }[];
  metric: Metric;
  unit: Unit;
}

interface GraphProps {
  datasets: Dataset[];
  mergedSets: any[]; // flattened merged data
}

const greenShades = ["#22c55e", "#166534", "#22c55e", "#166534"]; 
const redShades   = ["#ef4444", "#ef4444", "#ef4444", "#ef4444"];

function buildWaterfallData(mergedSets) {
  const keys = Object.keys(mergedSets[0]).filter(k => k !== "x");
  const result = [];

  keys.forEach((key) => {
    let cumulative = 0;

    mergedSets.forEach((row, i) => {
      const value = row[key];

      if (i === 0) {
        result.push({
          name: String(row.x), // x axis value (e.g., 1, 2, 3)
          key,                 // dataset name (e.g., "A")
          uv: value,
          pv: 0,
        });
        cumulative = value;
      } else {
        const prevValue = mergedSets[i - 1][key];
        const diff = value - prevValue;

        result.push({
          name: String(row.x),
          key,
          uv: diff,
          pv: cumulative,
        });

        cumulative += diff;
      }
    });
  });

  return result;
}

const WaterfallGraphSmall = ({ mergedSets, datasets }: GraphProps) => {
  const data = buildWaterfallData(mergedSets, datasets);

  // Compute unique metrics in order of appearance
  const metricOrder = Array.from(
    new Set(data.map(entry => entry.key))
  );
  console.log(metricOrder);

  return (
    <div className="flex flex-col items-start w-[75%] h-[400px] bg-gray-100 rounded-lg shadow p-4">
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="uv"
              interval={0}
              tickFormatter={(value, index) => {
                const current = data[index];
                const prev = data[index - 1];
                const next = data[index + 1];

                const isStart = !prev || current.key !== prev.key;
                const isEnd = !next || current.key !== next.key;

                if (!isStart && !isEnd) {
                  return current.key;
                }

                return "";
              }}
            />
            <YAxis />
            <Tooltip />
            <Legend />

            <Bar dataKey="pv" stackId="a" fill="transparent" />
            
            <Bar dataKey="uv" stackId="a">
              {data.map((entry, index) => {
                const metricIndex = metricOrder.indexOf(entry.key);
                {console.log(metricIndex)};
                const green = greenShades[metricIndex % greenShades.length];
                const red = redShades[metricIndex % redShades.length];

                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.uv >= 0 ? green : red}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WaterfallGraphSmall;