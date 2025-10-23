import React from 'react'
import {FaLeaf, FaThumbsDown, FaThumbsUp, FaUsers, FaHandPaper, FaUniversity} from "react-icons/fa"
import { RadialBarChart , ResponsiveContainer, RadialBar, Legend, PolarRadiusAxis} from 'recharts';


interface EGSScoreProps {
    social : number;
    environment : number;
    governance : number;
}
const EGSScoreLarge : React.FC<EGSScoreProps> = ({social, environment, governance}) => {

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
    <div className="flex flex-col items-start w-full h-[800px] bg-gray-100 rounded-lg shadow p-4">
        <h2 className='text-xl font-bold mb-4'> ESG Score </h2>

        <div className='grid grid-rows-4 gap-4 w-full h-full'>

            {/*Radial Graph */}
            <div className="flex justify-enter items-center w-full h-full">
                <ResponsiveContainer width="95%" height="100%">
                    <RadialBarChart 
                        cx = "25%"
                        innerRadius="40%" 
                        outerRadius="80%"
                        data={[
                            { name: "Environment", value: environment, fill : "#22c55e" },
                            { name: "Social", value: social, fill : "#3b82f6"},
                            { name: "Governance", value: governance, fill: "#eab308"}]}
                        startAngle={90}
                        endAngle={-270}>
                        <PolarRadiusAxis domain = {[0, 100]} tick = {false}/>
                        {/* need to be fix : using latest version of tailwind- minAngle = {5} */}
                        <RadialBar {...({ minAngle: 5 } as any)} background clockWise dataKey="value" label={{ position: "insideStart", fill: "#fff", fontSize: 12 }}/>
                        <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                    </RadialBarChart>
                </ResponsiveContainer>

            </div>
   
            {/*Environment */}
            <div className=' bg-white rounded-lg p-4 shadow-md flex items-center justify-between'>
                <div className='flex items-center gap-1'>
                    <FaLeaf className='text-green-500 text-3xl' />
                    <span className = "font-semibold text-gray-700 ml-3">Environment </span>
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

            <div className=' bg-white rounded-lg p-4 shadow-md flex items-center justify-between'>
                <div className='flex items-center gap-1'>
                    <FaUniversity className='text-yellow-500 text-3xl' />
                    <span className = "font-semibold text-gray-700 ml-3">Governance </span>
                </div>

                <div className='flex items-center gap-2'>
                    <span className = {`text-xl font-bold ${getScoreColor(governance)}`}>{governance}</span>
                    <span className = "ml-3">{getThumbIcon(governance)}</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default EGSScoreLarge