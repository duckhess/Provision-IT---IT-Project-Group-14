import React from 'react';
import { PolarAngleAxis, 
        PolarGrid, 
        PolarRadiusAxis, 
        Radar, 
        RadarChart, 
        ResponsiveContainer,
        Legend, 
        Tooltip,
} from 'recharts';

interface CategoryItem {
    name : string;
    averageSuccess : number;
    spotPercentageSuccess: number;
}

interface CategoryProps {
    datasets : CategoryItem[];
}

const CustomTick = ({ payload, x, y, textAnchor, ...rest }: any) => {
  const words = payload.value.split(" ");
  return (
    <text x={x} y={y} textAnchor={textAnchor} {...rest}>
      {words.map((word: string, index: number) => (
        <tspan
          key={index}
          x={x}
          dy={index === 0 ? 0 : 15} 
        >
          {word}
        </tspan>
      ))}
    </text>
  );
};

const CovenantsSummaryLarge : React.FC<CategoryProps> = ({datasets}) => {
  return (
    <div className="flex flex-col items-start w-[100%] h-[800px] bg-gray-100 rounded-lg shadow p-4 ">
        <h2 className='text-xl font-bold mb-4'> Covenants Summary</h2>
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius = "65%" data = {datasets} margin={{ top: 30, right: 30, bottom: 30, left: 30 }}>
                    <PolarGrid/>
                    <PolarAngleAxis dataKey="name" tick = {<CustomTick/>}/>
                    <PolarRadiusAxis />
                    <Radar name = "3 Year Average % Success" dataKey = "averageSuccess" stroke = "green" fill = "green" fillOpacity={0.5}/>
                    <Radar name = "Spot % Sucess" dataKey = "spotPercentageSuccess" stroke = "blue" fill = "blue" fillOpacity={0.2}/>
                    <Legend verticalAlign = "bottom" height = {36}></Legend> 
                    <Tooltip formatter = {(value : number) => `${value}%`}/>
                </RadarChart>
            </ResponsiveContainer>
        </div>
    </div>
  )
}

export default CovenantsSummaryLarge