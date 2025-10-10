import React from 'react'
import {FaLeaf, FaThumbsDown, FaThumbsUp, FaUsers, FaHandPaper} from "react-icons/fa"
import { RadialBarChart , ResponsiveContainer, RadialBar, Legend, PolarRadiusAxis} from 'recharts';


interface EGSScoreProps {
    social : number;
    environment : number;
}
const EGSScoreLarge : React.FC<EGSScoreProps> = ({social, environment}) => {

     const getScoreColor = (score : number) => {
            if (score >= 75) return "text-green-600";
            if (score >= 50) return "text-yellow-500";
            return "text-red-500";
        };
    
        const getThumbIcon = (score : number) =>{
            if (score >= 75) return <FaThumbsUp className='text-green-600 text-xl' title='Good'/>;
            if (score >= 50) return <FaHandPaper className='text-yellow-600 text-xl' title='Good'/>;
            return <FaThumbsDown className='text-red-500 text-xl'/>;
        }
  return (
    <div className="flex flex-col items-start w-[100%] h-[800px] bg-gray-100 rounded-lg shadow p-4">
        <h2 className='text-xl font-bold mb-4'> Environment and Social Score </h2>
        
        <div className='grid grid-rows-3 gap-4 w-full h-full'>
            <div className="w-full h-full min-w-[600px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                        innerRadius="40%" 
                        outerRadius="80%"
                        data={[
                            { name: "Environment", value: environment, fill : "#22c55e" },
                            { name: "Social", value: social, fill : "#3b82f6"},]}
                        startAngle={90}
                        endAngle={-270}>
                        <PolarRadiusAxis domain = {[0, 100]} tick = {false}/>
                        <RadialBar {...({ minAngle: 5 } as any)} background clockWise dataKey="value" label={{ position: "insideStart", fill: "#fff", fontSize: 12 }}/>
                        <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                    </RadialBarChart>
                </ResponsiveContainer>

            </div>
            {/*Environment */}
            <div className=' bg-white rounded-lg p-4 shadow-md flex items-center justify-between w-full'>
                <div className='flex items-center gap-1'>
                    <FaLeaf className='text-green-500 text-3xl' />
                    <span className = "font-semibold text-gray-700 ml-3">Environemnt </span>
                </div>

                <div className='flex items-center gap-2'>
                    <span className = {`text-xl font-bold ${getScoreColor(environment)}`}>{environment}</span>
                    <span className = "ml-3">{getThumbIcon(environment)}</span>
                </div>
            </div>
        
            {/* Social */}
            <div className=' bg-white rounded-lg p-4 shadow-md flex items-center justify-between'>
                <div className='flex items-center gap-1'>
                    <FaUsers className='text-blue-500 text-3xl' />
                    <span className = "font-semibold text-gray-700 ml-3">Social </span>
                </div>

                <div className='flex items-center gap-2'>
                    <span className = {`text-xl font-bold ${getScoreColor(social)}`}>{social}</span>
                    <span className = "ml-3">{getThumbIcon(social)}</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default EGSScoreLarge