import React, { useState } from 'react'
import ABSBenchmarkingLarge from './ABSBenchmarkingLarge';
import ABSBenchmarkingSmall from './ABSBenchmarkingSmall';

type MetricItem = {
    name : string;
    pass : boolean;
    calcValue : number;
    absValue: number;
    greater: boolean;
}

type ABSBenchmarkingProps  = {
    code : string;
    metricList: MetricItem[];
}

const ABSBenchmarking : React.FC<ABSBenchmarkingProps>= ({code, metricList}) => {

    const [expanded, setExpanded] = useState(false);

    const passMetrics = metricList.filter(m=>m.pass);
    const failMetrics = metricList.filter(m=>!m.pass);

    const passRate = metricList.length ? (passMetrics.length / metricList.length) * 100 : 0;

    const toggleExpand = () => setExpanded((prev)=> !prev);

  return (
    <div className="flex flex-col gap-2 w-full h-full">
        {expanded ? (
            <div onClick = {toggleExpand} className='cursor-pointer' data-testid="absLarge">

            <ABSBenchmarkingLarge 
                code = {code} 
                passList={passMetrics} 
                failList={failMetrics} 
                passRate={passRate}>            
            </ABSBenchmarkingLarge> 
        </div> ) : (
            <div onClick = {toggleExpand} className='cursor-pointer' data-testid="absSmall">
            <ABSBenchmarkingSmall 
                code = {code} 
                passNum = {passMetrics.length} 
                failNum = {failMetrics.length} 
                passRate = {passRate}>
            </ABSBenchmarkingSmall> 
            </div>
        )}
       
        
    </div>
    
  )
}

export default ABSBenchmarking