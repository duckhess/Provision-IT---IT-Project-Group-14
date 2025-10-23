import { ResponsiveContainer, BarChart, CartesianGrid, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import type { Dataset } from "../../Types/Types";

interface GraphProps {
  datasets: Dataset[];
  mergedSets: any[]; 
  title: String;
}

const greenShades = ["#22c55e", "#166534", "#22c55e", "#166534"]; 
const redShades   = ["#ef4444", "#ef4444", "#ef4444", "#ef4444"];

// function buildWaterfallData(mergedSets: any[]) {
//   const keys = Object.keys(mergedSets[0]).filter(k => k !== "x");
//   const result: any[] = [];

//   keys.forEach((key) => {
//     let cumulative = 0;

//     mergedSets.forEach((row, i) => {
//       const value = row[key];

//       if (i === 0) {
//         result.push({
//           name: String(row.x), 
//           key,                 
//           change: value,
//           pv: 0,
//         });
//         cumulative = value;
//       } else {
//         const prevValue = mergedSets[i - 1][key];
//         const diff = value - prevValue;

//         result.push({
//           name: String(row.x),
//           key,
//           change: diff,
//           pv: cumulative,
//         });

//         cumulative += diff;
//       }
//     });
//   });

//   return result;
// }

function buildWaterfallData(mergedSets: any[]) {
  if (!mergedSets || mergedSets.length === 0) return [];

  const keys = Object.keys(mergedSets[0]).filter(k => k !== "x");
  const result: any[] = [];

  keys.forEach((key) => {
    let cumulative = 0;

    mergedSets.forEach((row, i) => {
      const value = row[key];

      if (i === 0) {
        // First value just starts from 0
        result.push({
          name: String(row.x),
          key,
          change: value,
          pv: 0,
        });
        cumulative = value;
      } else {
        const prevValue = mergedSets[i - 1][key];
        const diff = value - prevValue;

        // Adjust baseline for negative changes
        const baseline = diff >= 0 ? cumulative : cumulative + diff;

        result.push({
          name: String(row.x),
          key,
          change: diff,
          pv: baseline,
        });

        cumulative += diff;
      }
    });
  });

  return result;
}


const WaterfallGraphSmall = ({ mergedSets, title }: GraphProps) => {
  
  const data = buildWaterfallData(mergedSets);

  // console.log("data = ",data);

  // Compute unique metrics in order of appearance
  const metricOrder = Array.from(
    new Set(data.map(entry => entry.key))
  );
  //console.log(metricOrder);

  return (
    <div className="flex flex-col items-start w-[75%] h-[400px] bg-gray-100 rounded-lg shadow p-4">
      <div className ="px-4 w-full">
        <h2 className='text-black text-xl font-bold border-b mb-4 inline-block break-words w-full'>
          {title}
        </h2>
      </div>
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="change"
              interval={0}
              tick={({x,y, index}) => {
                const item = data[index];
                if(!item) return <g/>;
                
                // show the metric name only for the first value
                const firstIndex = data.findIndex(d=>d.key === item.key);
                if(index !== firstIndex) return <g/>;
                return (
                  <g transform={`translate(${x}, ${y+10}) rotate(-45)`}>
                    <text 
                    textAnchor="end"
                    fontSize={12}
                    fill="#333">
                      {item.key}
                    </text>
                  </g>
                )
              }}
              angle={-45}
              textAnchor="end"
              height={100}

            />
            <YAxis />

            
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;

                // data format : (year, metricName, change, pv)
                const { name: year, key: metricName, change } = payload[0].payload;

                return (
                  <div className="bg-white p-2 rounded shadow text-sm min-w-[160px]">

                    <div className="font-bold mb-2">{metricName}</div>

                    {/* year and value (needs to be "change", dont change to pv)*/}
                    <div className="flex justify-between">
                      <span>{year}</span>
                      
                      <span>
                        {change !== undefined && change !== null
                          ? change.toLocaleString()
                          : (() => {
                              console.log("Invalid change value:", change, "for year:", year);
                              return "N/A";
                            })()
                        }
                      </span>
                    </div>
                  </div>
                );
              }}
            />

            <Bar dataKey="pv" stackId="a" fill="transparent" />
            
            <Bar dataKey="change" stackId="a">
              {data.map((entry, index) => {
                const metricIndex = metricOrder.indexOf(entry.key);
                // {console.log(metricIndex)};
                const green = greenShades[metricIndex % greenShades.length];
                const red = redShades[metricIndex % redShades.length];

                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.change >= 0 ? green : red}
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