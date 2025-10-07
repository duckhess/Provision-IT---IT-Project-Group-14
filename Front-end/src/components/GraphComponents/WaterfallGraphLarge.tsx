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

const WaterfallGraphSmall = ({ mergedSets }) => {
  const data = buildWaterfallData(mergedSets); // your fixed data builder


  return (
    <div className="flex flex-col items-start w-[100%] h-[800px] bg-gray-100 rounded-lg shadow p-4">
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
                return current.key; // middle bar
                }

                return ""; // hide on start and end
            }}
            />
            <YAxis />
            <Tooltip />
            <Legend />

            {/* Transparent offset bar */}
            <Bar dataKey="pv" stackId="a" fill="transparent"/>

            {/* Colored value bar (red/green) */}
            <Bar dataKey="uv" stackId="a">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.uv >= 0 ? "#22c55e" : "#ef4444"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WaterfallGraphSmall;