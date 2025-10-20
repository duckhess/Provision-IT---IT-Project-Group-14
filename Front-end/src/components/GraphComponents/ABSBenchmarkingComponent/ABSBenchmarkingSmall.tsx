import React from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa';


type ABSBenchmarkingSmallProps  = {
  code : string;
  passNum: number;
  failNum: number;
  passRate: number;
}

export const getScoreColor = (score : number) => {
  if (score >= 70) return "text-green-600";
  if (score >= 50) return "text-yellow-500";
  return "text-red-500";
};

const ABSBenchmarkingSmall : React.FC<ABSBenchmarkingSmallProps> = ({code, passNum, failNum, passRate}) => {


  return (
  <div className = "flex flex-col items-start w-[75%] h-[400px] bg-gray-100 rounded-lg shadow p-4">
    <h2 className='text-black text-xl font-bold border-b mb-4 inline-block'>
      ABS Benchmarking
    </h2>

    <p className = " text-black">Code : {code} </p>

    <p>
      Pass Rate :  
      <span className={`ml-1.5 font-semi-bold ${getScoreColor(passRate)}`}>
      {passRate.toFixed(2)}%
      </span>
    </p>

    <div className='mt-6 flex-1 grid grid-rows-2 gap-4 w-full'>

      <div className='flex flex-row items-center bg-green-50 rounded-lg p-4 gap-2 w-full h-full justify-between'>
        <div className='flex items-center gap-1'>
        <FaCheck className='text-green-500 text-3xl' />
        <span className = "font-semibold text-black ml-3">Pass </span>
      </div>

      <div className='flex items-center gap-2'>
        <span className = 'text-black font-semibold text-xl'>{passNum}</span>
      </div>

      </div>

      <div className='flex flex-row items-center bg-red-50 rounded-lg p-4 gap-2 w-full h-full justify-between'>
        <div className='flex items-center gap-1'>
        <FaTimes className='text-red-400 text-3xl' />
        <span className = "font-semibold text-black ml-3">Fail </span>
      </div>

      <div className='flex items-center gap-2'>
        <span className = 'text-black font-semibold text-xl'>{failNum}</span>
      </div>

      </div>

    </div>

  </div>
  )
}

export default ABSBenchmarkingSmall