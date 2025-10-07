import React from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa';


type ABSBenchmarkingSmallProps  = {
    code : string;
    passNum: number;
    failNum: number;
    passRate: number;
}

const ABSBenchmarkingSmall : React.FC<ABSBenchmarkingSmallProps> = ({code, passNum, failNum, passRate}) => {
  return (
    <div className = "flex flex-col items-start w-[75%] h-[400px] bg-gray-100 rounded-lg shadow p-4">
      <div className ="px-4 w-full">
          <h2 className='text-black text-xl font-bold border-b mb-4 inline-block'>
              ABS Benchmarking
          </h2>
          <p className = " text-black">Code : {code} </p>
          <p>
              Pass Rate :  
              <span className={`ml-1.5 font-semi-bold ${passRate >= 70 ? "text-green-600" : passRate < 50 ? "text-red-600" : "text-yellow-600"}`}>
              {passRate.toFixed(2)}%</span>
          </p>
          <div className='mt-6 space-y-2'>
            <div className='flex flex-row items-center bg-green-50 rounded-lg p-1 gap-2'>
               <p className='text-black font-semibold m-0'>Pass: {passNum}</p>
              <FaCheck className='text-green-400'></FaCheck>
            </div>

            <div className='flex flex-row items-center bg-red-50 rounded-lg p-1 gap-2'>
              <p className='text-black font-semibold m-0'>Fail: {failNum}</p>
              <FaTimes className='text-red-400'></FaTimes>
            </div>
            
           
          </div>
           </div>
    </div>
  )
}

export default ABSBenchmarkingSmall