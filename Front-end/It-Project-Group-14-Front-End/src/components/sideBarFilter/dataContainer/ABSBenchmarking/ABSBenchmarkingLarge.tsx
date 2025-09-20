import React from 'react'
import {FaCheck, FaTimes} from "react-icons/fa";

type MetricItem = {
    name : string;
    pass : boolean;
    calc_value : number;
    abs_value: number;
}

type ABSBenchmarkingProps  = {
    code : string;
    pass_list: MetricItem[];
    fail_list: MetricItem[];
    passRate: number;
}

const ABSBenchmarkingLarge : React.FC<ABSBenchmarkingProps>= ({code, pass_list, fail_list, passRate}) => {

  return (
    <div className='flex flex-col items-start w-[500px] h-[500px] bg-gray-100 rounded-lg shadow p-4'>
        <div className ="px-4 w-full">
            <h2 className='text-black text-xl font-bold border-b mb-4 inline-block'>
                ABS Benchmarking
            </h2>
            {/* Data needs to be read in and filled here */}
            <p className = " text-black">Code : {code} </p>
            <p>
                    Pass Rate :  
                    <span className={`ml-1.5 font-semi-bold ${passRate >= 70 ? "text-green-600" : passRate < 50 ? "text-red-600" : "text-yellow-600"}`}>
                    {passRate.toFixed(2)}%</span></p>
            <div className="grid grid-cols-2 w-full h-[65%] mt-4 gap-4">
                <div className = "bg-green-50 p-2 rounded-md h-full overflow-y-scroll scrollbar-hide">
                    <div className='flex items-center gap-2 mb-2'>
                        <h3 className='font-bold'>Pass</h3>
                         <FaCheck className='text-green-400 inline'></FaCheck>
                    </div>
                    {pass_list.map(metric => (
                        <p key = {metric.name} title = {`Calc : ${metric.calc_value}, ABS : ${metric.abs_value}`}  
                        className = "cursor-pointer">{metric.name}</p>
                    ))}
                </div>
                <div className = "bg-red-50 p-2 rounded-md h-full overflow-y-scroll scrollbar-hide">
                    <div className='flex items-center gap-2 mb-2'>
                        <h3 className='font-bold'>Fail</h3>
                    <FaTimes className='text-red-400 inline'></FaTimes>
                    </div>
                   
                    {fail_list.map(metric => (
                        <p key = {metric.name} title = {`Calc : ${metric.calc_value}, ABS : ${metric.abs_value}`}  
                        className = "cursor-pointer">{metric.name}</p>
                    ))}
                </div>          
            </div>
        </div>

    </div>
  )
}

export default ABSBenchmarkingLarge