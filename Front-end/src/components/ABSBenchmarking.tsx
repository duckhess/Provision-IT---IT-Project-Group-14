import React, { useState } from 'react'
import ABSBenchmarkingLarge from './ABSBenchmarkingLarge.tsx';
import ABSBenchmarkingSmall from './ABSBenchmarkingSmall.tsx';

type MetricItem = {
    name : string;
    pass : boolean;
    calc_value : number;
    abs_value: number;
    greater: boolean;
}

type ABSBenchmarkingProps  = {
    code : string;
    metric_list: MetricItem[];
}

const ABSBenchmarking : React.FC<ABSBenchmarkingProps>= ({code, metric_list}) => {

    const [expanded, setExpanded] = useState(false);

    const passMetrics = metric_list.filter(m=>m.pass);
    const failMetrics = metric_list.filter(m=>!m.pass);

    const passRate = metric_list.length ? (passMetrics.length / metric_list.length) * 100 : 0;

    const toggleExpand = () => setExpanded((prev)=> !prev);

  return (
    <div className="flex flex-col gap-2 w-full h-full">
        {expanded ? (
            <div onClick = {toggleExpand} className='cursor-pointer'>

            <ABSBenchmarkingLarge 
                code = {code} 
                pass_list={passMetrics} 
                fail_list={failMetrics} 
                passRate={passRate}>            
            </ABSBenchmarkingLarge> 
        </div> ) : (
            <div onClick = {toggleExpand} className='cursor-pointer'>
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