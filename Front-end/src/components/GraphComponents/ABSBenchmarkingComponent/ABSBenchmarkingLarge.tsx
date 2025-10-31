import React from 'react'
import {FaCheck, FaTimes} from "react-icons/fa";
import getScoreColour from '../../../utils/getScoreColour';
type MetricItem = {
    name : string;
    pass : boolean;
    calcValue : number;
    absValue: number;
    greater: boolean;
}

type ABSBenchmarkingProps  = {
    code : string;
    passList: MetricItem[];
    failList: MetricItem[];
    passRate: number;
}

const ABSBenchmarkingLarge : React.FC<ABSBenchmarkingProps>= ({code, passList, failList, passRate}) => {

  return (
    <div className='flex flex-col items-start w-[100%] h-[800px] bg-gray-100 rounded-lg shadow p-4'>
        
        {/* Header part of the component - showing metric name and pass rate */}
        <h2 className='text-black text-xl font-bold border-b mb-4 inline-block'>
            ABS Benchmarking
        </h2>
        
        <p className = " text-black">Code : {code} </p>
        
        <p>
            Pass Rate :  
            <span className={`ml-1.5 font-semi-bold ${getScoreColour(passRate)}`}>
            {passRate.toFixed(2)}%</span>
        </p>

        <div className="grid grid-cols-2 w-full h-[65%] mt-4 gap-4">
            <div className = "bg-green-50 p-2 rounded-md h-full flex flex-col overflow-y-scroll scrollbar-hide">

                {/* Pass section - showing number of pass and all the metrics that passes the benchmark */}
                <div className='flex items-center justify-between mb-2' data-testid="passHeader">
                    <div className='flex items-center gap-2'>
                        <FaCheck className='text-green-400 text-xl' />
                        <h3 className='font-bold text-lg'>Pass</h3>
                    </div>
                    <p className='font-semibold text-lg'>{passList.length}</p>
                </div>
            

                <div className = "flex-1 rounded-md p-2" data-testid="passSection">
                    <ul className='list-disc pl-5'>
                    {passList.map(metric => (
                        <li key = {metric.name} title = {`Calc : ${metric.calcValue} ABS : ${metric.absValue}`}  
                        className = "cursor-pointer">
                        {metric.name}
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
            
            {/* Fail section - showing number of fail and all the metrics that fail the benchmark */}
            <div className = "bg-red-50 p-2 rounded-md h-full flex flex-col overflow-y-scroll scrollbar-hide">
                <div className='flex items-center justify-between mb-2' data-testid="failHeader">
                    <div className='flex items-center gap-2'>
                        <FaTimes className='text-red-400 text-xl' />
                        <h3 className='font-bold text-lg'>Fail</h3>
                    </div>
                    <p className='font-semibold text-lg'>{failList.length}</p>
                </div>
            

                <div className = "flex-1 rounded-md p-2" data-testid="failSection">
                    <ul className='list-disc pl-5'>
                    {failList.map(metric => (
                        <li key = {metric.name} title = {`Calc : ${metric.calcValue} ABS : ${metric.absValue}`}  
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

export default ABSBenchmarkingLarge
