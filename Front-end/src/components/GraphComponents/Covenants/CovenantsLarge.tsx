import React from 'react'
import {FaCheck, FaTimes} from "react-icons/fa";

type MetricItem = {
    name : string;
    pass : boolean;
    calc_value: number;
    abs_value: number;
}

type CovenantsLargeProps = {
    category : string;
    pass_list: MetricItem[];
    fail_list: MetricItem[];
    spotPercentageRate: number;
    threeYearAverageSuccess : number;
}

const CovenantsLarge : React.FC<CovenantsLargeProps> = ({category, pass_list, fail_list, spotPercentageRate, threeYearAverageSuccess}) => {
    const getScoreColor = (score : number) => {
    if (score >= 75) return "text-green-600";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
    };

    return (
    <div className='flex flex-col items-start w-[100%] h-[800px] bg-gray-100 rounded-lg shadow p-4'>
        
        <h2 className='text-black text-xl font-bold border-b mb-4 inline-block'>
           Covenants
        </h2>
        
        <p className = " text-black break-words">Category : {category} </p>
        <p>
           Spot % Success :  
           <span className={`ml-1.5 font-semi-bold ${getScoreColor(spotPercentageRate)}`}>
           {spotPercentageRate.toFixed(2)}%
           </span>
         </p>

        <p>
            Three Year Average Success:  
            <span className={`ml-1.5 font-semi-bold ${getScoreColor(threeYearAverageSuccess)}`}>
            {threeYearAverageSuccess.toFixed(2)}%
            </span>
         </p>

        <div className="grid grid-cols-2 w-full h-[65%] mt-4 gap-4">
            <div className = "bg-green-50 p-2 rounded-md h-full flex flex-col overflow-y-scroll scrollbar-hide">
                <div className='flex items-center justify-between mb-2' data-testid="passHeader">
                    <div className='flex items-center gap-2'>
                        <FaCheck className='text-green-400 text-xl' />
                        <h3 className='font-bold text-lg'>Pass</h3>
                    </div>
                    <p className='font-semibold text-lg'>{pass_list.length}</p>
                </div>
            

                <div className = "flex-1 rounded-md p-2" data-testid="passSection">
                    <ul className='list-disc pl-5'>
                    {pass_list.map(metric => (
                        <li key = {metric.name} title = {`Calc : ${metric.calc_value} ABS : ${metric.abs_value}`}  
                        className = "cursor-pointer">
                        {metric.name}
                        </li>
                    ))}
                    </ul>
                </div>
            </div>

            <div className = "bg-red-50 p-2 rounded-md h-full flex flex-col overflow-y-scroll scrollbar-hide">
                <div className='flex items-center justify-between mb-2' data-testid="failHeader">
                    <div className='flex items-center gap-2'>
                        <FaTimes className='text-red-400 text-xl' />
                        <h3 className='font-bold text-lg'>Fail</h3>
                    </div>
                    <p className='font-semibold text-lg'>{fail_list.length}</p>
                </div>
            

                <div className = "flex-1 rounded-md p-2" data-testid="failSection">
                    <ul className='list-disc pl-5'>
                    {fail_list.map(metric => (
                        <li key = {metric.name} title = {`Calc : ${metric.calc_value} ABS : ${metric.abs_value}`}  
                        className = "cursor-pointer">
                        {metric.name}
                        </li>
                    ))}
                    </ul>
                </div>
            </div>  
        </div>
    </div>

    )
}

export default CovenantsLarge